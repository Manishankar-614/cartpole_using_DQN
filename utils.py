import matplotlib.pyplot as plt

def plot_scores(scores):
    plt.plot(scores, label="Score")

    avg = []
    for i in range(len(scores)):
        avg.append(sum(scores[max(0, i-10):i+1]) / len(scores[max(0, i-10):i+1]))

    plt.plot(avg, label="Moving Avg")
    plt.legend()
    plt.xlabel("Episodes")
    plt.ylabel("Score")
    plt.title("DQN CartPole")
    plt.show()