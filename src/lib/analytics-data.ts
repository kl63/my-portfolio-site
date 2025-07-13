// Mock data for analytics dashboard

export const pageViewsData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 }
]

export const visitorsByDeviceData = [
  { name: 'Desktop', value: 54 },
  { name: 'Mobile', value: 38 },
  { name: 'Tablet', value: 8 }
]

export const bounceRateData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 62 },
  { name: 'Apr', value: 58 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 52 },
  { name: 'Jul', value: 48 }
]

export const topPagesData = [
  { name: 'Home', visitors: 3245 },
  { name: 'Portfolio', visitors: 2186 },
  { name: 'Projects', visitors: 1723 },
  { name: 'Skills', visitors: 1452 },
  { name: 'Contact', visitors: 964 }
]

export const usersByCountryData = [
  { name: 'USA', value: 38 },
  { name: 'India', value: 12 },
  { name: 'UK', value: 9 },
  { name: 'Germany', value: 7 },
  { name: 'Canada', value: 6 },
  { name: 'France', value: 5 },
  { name: 'Others', value: 23 }
]

export const overviewStats = {
  visitors: {
    value: '32.4K',
    changePercent: 12.2,
    description: 'Total visitors this month'
  },
  pageviews: {
    value: '94.8K',
    changePercent: 8.7,
    description: 'Total pageviews this month'
  },
  avgSessionDuration: {
    value: '2:32',
    changePercent: 3.4,
    description: 'Average time on site'
  },
  bounceRate: {
    value: '48.2%',
    changePercent: -6.8,
    description: 'Visitors who leave after viewing only one page'
  }
}
