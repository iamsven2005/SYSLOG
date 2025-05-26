
# System Monitoring Dashboard - Charts

This folder contains React components for visualizing system metrics such as **CPU usage**, **memory usage**, **disk usage**, and **sensor data**. These charts are designed to work within a **Next.js** environment, utilizing **Recharts** for rendering dynamic and interactive visualizations.

## Folder Structure

```
/charts
  /UsageChart.tsx         # Visualizes CPU and memory usage over time
  /DiskUsageChart.tsx     # Visualizes disk usage over time
  /MemoryUsageChart.tsx   # Visualizes memory usage statistics
  /SensorChart.tsx        # Displays sensor data (temperature, voltage, etc.)
```

### Components

#### `UsageChart.tsx`

* **Description**: Displays the usage of CPU and memory over time.
* **Features**:

  * Toggle between **CPU** and **Memory** metrics using tab-based controls.
  * Multi-device filtering with popover interface.
  * Custom tooltips for per-device metric values.
  * Export functionality to Excel.

#### `DiskUsageChart.tsx`

* **Description**: Tracks disk usage across devices and disks.
* **Features**:

  * Displays disk usage percentage, used GB, or free GB over time.
  * Time range selection (1 hour, 6 hours, 24 hours, 7 days).
  * Multi-select for devices and disks with popover filtering.
  * Dynamic LineChart with color-coded device legends.
  * Export chart data to Excel.

#### `MemoryUsageChart.tsx`

* **Description**: Displays memory usage statistics for system hosts or virtual machines (VMs).
* **Features**:

  * Toggle between **host** and **VM** views.
  * Support for **LineChart** and **AreaChart** rendering.
  * Time range selection (1 hour, 6 hours, 24 hours, 7 days).
  * Multi-host filtering via command-style popovers.
  * Export chart data to Excel.

#### `SensorChart.tsx`

* **Description**: Visualizes temperature and voltage sensor data.
* **Features**:

  * Switch between **temperature** and **voltage** views.
  * Multi-host and multi-sensor filtering with dynamic popovers.
  * Custom tooltips for grouped sensor readings by host.
  * Responsive LineChart with adaptive scaling.
  * Export sensor data to Excel.

## Usage

### Integrating with the Dashboard

These components are designed to be imported and used within your dashboard. You can import and place them in your main page as follows:

```jsx
import UsageChart from "@/components/charts/UsageChart";
import DiskUsageChart from "@/components/charts/DiskUsageChart";
import MemoryUsageChart from "@/components/charts/MemoryUsageChart";
import SensorChart from "@/components/charts/SensorChart";

// Inside your page component
<UsageChart />
<DiskUsageChart />
<MemoryUsageChart />
<SensorChart />
```

### Configuring Time Ranges

Each chart component allows the user to select a time range to view the data:

* **Last Hour** (`1h`)
* **Last 6 Hours** (`6h`)
* **Last 24 Hours** (`24h`)
* **Last 7 Days** (`7d`)

This is handled via a dropdown/select UI, allowing users to easily choose the time range that suits their needs.

### Data Export

Each chart includes an **Export to Excel** button, which allows users to download the displayed data for offline analysis.

* The export functionality uses **Excel export utilities** that format the data for easy use.
* The exported data includes all the necessary metrics, timestamps, and related information.