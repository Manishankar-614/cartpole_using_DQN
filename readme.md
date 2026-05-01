# 🚀 CartPole DQN Space Simulator

An interactive web-based simulation of the classic CartPole problem using **Deep Q-Learning (DQN)** with real-time visualization, manual control, and mobile support.

---

## 🧠 Project Overview

This project demonstrates how an AI agent learns to balance a pole on a moving cart using **Reinforcement Learning (RL)**.

The system includes:
- 🎮 Interactive controls (AI + Manual + Mobile)
- 📊 Real-time performance graph
- 🌌 Animated UI
- 🤖 Deep Q-Network (DQN) model

---

## 🎯 Objective

Keep the pole balanced for as long as possible by moving the cart left or right.

The longer it stays balanced → higher the score.

---

## 🧩 How It Works

### 🔁 Reinforcement Learning Loop

1. Agent observes environment (state)
2. Chooses an action (left/right)
3. Environment responds (new state + reward)
4. Agent learns from experience
5. Repeats until optimal behavior

---

### 🧠 DQN (Deep Q-Network)

Instead of a Q-table, we use a **neural network** to predict Q-values:
Q(state, action)

The model learns:
- Which action is best for each state
- How to maximize long-term reward

---

### 📊 Visualization

- Real-time score updates
- Graph showing:
  - Score per episode
  - Moving average (performance trend)

---

## 🎮 Controls

| Mode        | Control                     |
|------------|----------------------------|
| AI Mode     | Click "Start AI"           |
| Manual      | Arrow keys (← →)           |
| Mobile      | Buttons / Swipe / Joystick |

---

## 📱 Features

- 🌌 Space animated background
- 🎮 Multiple control methods
- 📊 Live graph visualization
- 😎 Game Over overlay UI
- 📱 Mobile-friendly controls

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Manishankar-614/cartpole_using_DQN
cd cartpole

2️⃣ Create virtual environment (recommended)

python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

3️⃣ Install dependencies

pip install -r requirements.txt

4️⃣ Train the model (optional but recommended)

python gui.py

This will generate:

dqn_cartpole.pth

5️⃣ Run the web app

python app.py

6️⃣ Open in browser

http://127.0.0.1:5000
📈 How to Improve AI Performance

To increase score:

Increase training episodes:
episodes = 1000 → 2000
Adjust exploration:
epsilon_decay = 0.995
epsilon_min = 0.01
Increase replay memory:
maxlen = 5000
Train more frequently


🧠 Key Concepts
🔹 Reinforcement Learning

Learning by interacting with an environment using rewards and penalties.

🔹 Agent

The AI that takes actions.

🔹 Environment

The system the agent interacts with (CartPole).

🔹 State

Current situation (position, velocity, angle).

🔹 Action

Move left or right.

🔹 Reward

Feedback signal (+1 for staying balanced).

🔹 Episode

One full run until failure.

🔹 DQN

Deep Q-Network — neural network used to approximate Q-values.

🔹 Exploration vs Exploitation
Exploration → trying new actions
Exploitation → using learned actions