import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('dark_background')
accent_color = '#ffffff'

def create_visuals(file_path):
    df = pd.read_csv(file_path)
    df['DateTime_Measured'] = pd.to_datetime(df['DateTime_Measured'])
    df = df.dropna(subset=['Total_Demand_KW'])
    
    df['Month'] = df['DateTime_Measured'].dt.month
    monthly_avg = df.groupby('Month')['Total_Demand_KW'].mean()
    
    plt.figure(figsize=(10, 6))
    monthly_avg.plot(kind='bar', color=accent_color, alpha=0.8)
    plt.title('Seasonal Shifts (Average kW by Month)', fontsize=14, pad=20)
    plt.xlabel('Month', fontsize=12)
    plt.ylabel('Demand (kW)', fontsize=12)
    plt.xticks(range(12), ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], rotation=45)
    plt.grid(axis='y', linestyle='--', alpha=0.3)
    plt.tight_layout()
    plt.savefig('analysis_seasonal.png')

    df['DayOfWeek'] = df['DateTime_Measured'].dt.dayofweek
    weekly_avg = df.groupby('DayOfWeek')['Total_Demand_KW'].mean()
    
    plt.figure(figsize=(10, 6))
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weekly_avg.plot(kind='bar', color=[accent_color if i < 5 else '#555555' for i in range(7)], alpha=0.8)
    plt.title('Weekly Rhythms (Workweek vs Weekend)', fontsize=14, pad=20)
    plt.xlabel('Day of Week', fontsize=12)
    plt.ylabel('Demand (kW)', fontsize=12)
    plt.xticks(range(7), days, rotation=45)
    plt.grid(axis='y', linestyle='--', alpha=0.3)
    plt.tight_layout()
    plt.savefig('analysis_weekly.png')

    df['Hour'] = df['DateTime_Measured'].dt.hour
    hourly_avg = df.groupby('Hour')['Total_Demand_KW'].mean()
    
    plt.figure(figsize=(12, 6))
    plt.plot(hourly_avg.index, hourly_avg.values, color=accent_color, linewidth=2, marker='o', markersize=4)
    plt.fill_between(hourly_avg.index, hourly_avg.values, color=accent_color, alpha=0.1)
    plt.title('Daily Heartbeat (Average 24-Hour Profile)', fontsize=14, pad=20)
    plt.xlabel('Hour of Day', fontsize=12)
    plt.ylabel('Demand (kW)', fontsize=12)
    plt.xticks(range(24))
    plt.grid(alpha=0.2)
    plt.tight_layout()
    plt.savefig('analysis_daily.png')

if __name__ == "__main__":
    try:
        create_visuals('data.csv')
    except Exception as e:
        print(f"Error: {e}")
