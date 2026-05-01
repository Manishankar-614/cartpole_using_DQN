from flask import Flask, jsonify, render_template
import gymnasium as gym
import torch
from agent import Agent

app = Flask(__name__)

env = gym.make("CartPole-v1")
state, _ = env.reset()

state_size = env.observation_space.shape[0]
action_size = env.action_space.n

agent = Agent(state_size, action_size)

try:
    agent.model.load_state_dict(torch.load("dqn_cartpole.pth"))
    agent.epsilon = 0
except:
    print("No model")

score = 0
done_flag = False
training_scores = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/step")
def step():
    global state, score, done_flag, training_scores

    if done_flag:
        return jsonify({"state": state.tolist(), "done": True, "score": score})

    action = agent.act(state)
    state, _, terminated, truncated, _ = env.step(action)

    done = terminated or truncated

    if not done:
        score += 1
    else:
        done_flag = True
        training_scores.append(score)

    return jsonify({"state": state.tolist(), "done": done, "score": score})

# ✅ FIXED MANUAL ROUTE
@app.route("/manual/<int:action>")
def manual(action):
    global state, score, done_flag, training_scores

    if done_flag:
        return jsonify({"state": state.tolist(), "done": True, "score": score})

    state, _, terminated, truncated, _ = env.step(action)
    done = terminated or truncated

    if not done:
        score += 1
    else:
        done_flag = True
        training_scores.append(score)

    return jsonify({"state": state.tolist(), "done": done, "score": score})

@app.route("/reset")
def reset():
    global state, score, done_flag
    state, _ = env.reset()
    score = 0
    done_flag = False
    return jsonify({"state": state.tolist(), "score": score})

@app.route("/stats")
def stats():
    return jsonify({"scores": training_scores})

if __name__ == "__main__":
    app.run(debug=True)