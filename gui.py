import tkinter as tk
from tkinter import scrolledtext
import threading
import gymnasium as gym
import torch

from agent import Agent
from utils import plot_scores

class DQNApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CartPole DQN Dashboard")

        self.env = gym.make("CartPole-v1")

        state_size = self.env.observation_space.shape[0]
        action_size = self.env.action_space.n

        self.agent = Agent(state_size, action_size)
        self.scores = []

        tk.Button(root, text="Train", command=self.start_training).pack()
        tk.Button(root, text="Test", command=self.test_agent).pack()
        tk.Button(root, text="Graph", command=self.show_plot).pack()

        self.log_area = scrolledtext.ScrolledText(root, width=60, height=20)
        self.log_area.pack()

    def log(self, msg):
        self.log_area.insert(tk.END, msg + "\n")
        self.log_area.see(tk.END)

    def start_training(self):
        threading.Thread(target=self.train).start()

    def train(self):
        episodes = 100

        for e in range(episodes):
            state, _ = self.env.reset()
            total_reward = 0

            for t in range(200):
                action = self.agent.act(state)
                next_state, reward, terminated, truncated, _ = self.env.step(action)
                done = terminated or truncated

                self.agent.memory.add((state, action, reward, next_state, done))

                state = next_state
                total_reward += reward

                if t % 4 == 0:
                    self.agent.train()

                if done:
                    break

            self.agent.target_model.load_state_dict(self.agent.model.state_dict())
            self.scores.append(total_reward)

            avg = sum(self.scores[-10:]) / min(len(self.scores), 10)

            self.log(f"Ep {e+1} | Score {total_reward:.1f} | Avg {avg:.1f} | Eps {self.agent.epsilon:.3f}")

            if avg > 195:
                self.log("✅ Solved!")
                break

        torch.save(self.agent.model.state_dict(), "dqn_cartpole.pth")
        self.log("Model Saved!")

    def test_agent(self):
        env = gym.make("CartPole-v1", render_mode="human")
        state, _ = env.reset()

        for _ in range(200):
            action = self.agent.act(state)
            state, _, terminated, truncated, _ = env.step(action)
            if terminated or truncated:
                break

        env.close()

    def show_plot(self):
        plot_scores(self.scores)

if __name__ == "__main__":
    root = tk.Tk()
    app = DQNApp(root)
    root.mainloop()