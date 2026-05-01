import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import random

from dqn_model import DQN
from replay_buffer import ReplayBuffer

class Agent:
    def __init__(self, state_size, action_size):
        self.model = DQN(state_size, action_size)
        self.target_model = DQN(state_size, action_size)
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)

        self.memory = ReplayBuffer()

        self.gamma = 0.95
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(2)

        state = torch.FloatTensor(state)
        q_values = self.model(state)
        return torch.argmax(q_values).item()

    def train(self, batch_size=32):
        if self.memory.size() < batch_size:
            return

        batch = self.memory.sample(batch_size)

        for state, action, reward, next_state, done in batch:
            state = torch.FloatTensor(state)
            next_state = torch.FloatTensor(next_state)

            target = reward
            if not done:
                target += self.gamma * torch.max(self.target_model(next_state)).item()

            target = torch.tensor(target, dtype=torch.float32)

            target_f = self.model(state).clone().detach()
            target_f[action] = target

            output = self.model(state)
            loss = nn.MSELoss()(output, target_f)

            self.optimizer.zero_grad()
            loss.backward()
            self.optimizer.step()

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay