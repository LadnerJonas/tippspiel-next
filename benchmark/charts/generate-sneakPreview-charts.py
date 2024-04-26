import pandas as pd
import matplotlib.pyplot as plt

# Create a DataFrame with the benchmark results
data = {
    'Caching Strategy': ['Fully Cached', '1s Cached', 'No Cache (stopped after 123s)'],
    'Time taken for tests (s)': [3.856, 5.448, 123.322],
    'Requests per second': [3890.45, 2753.10, 11.34],
    'Time per request (ms)': [0.257, 0.363, 88.150],
    'Transfer rate (Kbytes/sec)': [2944.43, 2083.65, 8.59],
    'Total transferred (Kbytes)': [11625.00, 11625.00, 1084.23]  # Added new metric
}
df = pd.DataFrame(data)

# Assuming you have a DataFrame df_percentiles with the percentile data
# For example:
df_percentiles = pd.DataFrame({
    'Fully Cached': {50: 2, 66: 2, 75: 2, 80: 3, 90: 4, 95: 4, 98: 5, 99: 5, 100: 8},
    '1s Cached': {50: 2, 66: 2, 75: 2, 80: 2, 90: 2, 95: 4, 98: 5, 99: 5, 100: 1031},
    'No Cache (stopped after 123s)': {50: 765, 66: 817, 75: 1099, 80: 1141, 90: 1199, 95: 1241, 98: 1266, 99: 1292, 100: 1434}
})

# Plot the data
fig, axs = plt.subplots(3, 2, figsize=(20, 20))

# Plot and annotate the bars
for i, metric in enumerate(['Time taken for tests (s)', 'Requests per second', 'Time per request (ms)', 'Transfer rate (Kbytes/sec)', 'Total transferred (Kbytes)']):
    ax = axs[i // 2, i % 2]
    bars = ax.bar(df['Caching Strategy'], df[metric])
    ax.set_title(metric)

    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, yval, round(yval, 2), ha='center', va='bottom')

# Create the boxplot directly from the DataFrame
df_percentiles.boxplot(ax=axs[2, 1])
axs[2, 1].set_title('Percentage of the requests served within a certain time (ms)')

# Add y-labels and rotate them to avoid overlap
axs[2, 1].set_ylabel('Response Time (ms)')
axs[2, 1].set_yticklabels(axs[2, 1].get_yticks(), rotation=45)

plt.tight_layout()
plt.savefig('charts.png',dpi=100)
plt.show()
plt.draw()