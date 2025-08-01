const mockSalesDataArray = [
	[
		{ name: 'Mon', sales: 4000, revenue: 2400 },
		{ name: 'Tue', sales: 3000, revenue: 1398 },
		{ name: 'Wed', sales: 2000, revenue: 9800 },
		{ name: 'Thu', sales: 2780, revenue: 3908 },
		{ name: 'Fri', sales: 1890, revenue: 4800 },
		{ name: 'Sat', sales: 2390, revenue: 3800 },
		{ name: 'Sun', sales: 3490, revenue: 4300 },
	],
	[
		{ name: 'Mon', sales: 3200, revenue: 2200 },
		{ name: 'Tue', sales: 2800, revenue: 1600 },
		{ name: 'Wed', sales: 3100, revenue: 7200 },
		{ name: 'Thu', sales: 3300, revenue: 4500 },
		{ name: 'Fri', sales: 1900, revenue: 4100 },
		{ name: 'Sat', sales: 2600, revenue: 3900 },
		{ name: 'Sun', sales: 3700, revenue: 4700 },
	],
	[
		{ name: 'Mon', sales: 4100, revenue: 2600 },
		{ name: 'Tue', sales: 3500, revenue: 1500 },
		{ name: 'Wed', sales: 2900, revenue: 9100 },
		{ name: 'Thu', sales: 3000, revenue: 3700 },
		{ name: 'Fri', sales: 2000, revenue: 5000 },
		{ name: 'Sat', sales: 2500, revenue: 3600 },
		{ name: 'Sun', sales: 3400, revenue: 4400 },
	],
	[
		{ name: 'Mon', sales: 3900, revenue: 2300 },
		{ name: 'Tue', sales: 2700, revenue: 1800 },
		{ name: 'Wed', sales: 2200, revenue: 8800 },
		{ name: 'Thu', sales: 2900, revenue: 4000 },
		{ name: 'Fri', sales: 2100, revenue: 4700 },
		{ name: 'Sat', sales: 2800, revenue: 4000 },
		{ name: 'Sun', sales: 3600, revenue: 4200 },
	],
	[
		{ name: 'Mon', sales: 4300, revenue: 2500 },
		{ name: 'Tue', sales: 3400, revenue: 1700 },
		{ name: 'Wed', sales: 2600, revenue: 9600 },
		{ name: 'Thu', sales: 3100, revenue: 4200 },
		{ name: 'Fri', sales: 1800, revenue: 4900 },
		{ name: 'Sat', sales: 2400, revenue: 3700 },
		{ name: 'Sun', sales: 3500, revenue: 4500 },
	],
];

const mockCategoryDataArray = [
	[
		{ name: 'Electronics', value: 35, color: '#8884d8' },
		{ name: 'Clothing', value: 25, color: '#82ca9d' },
		{ name: 'Food', value: 20, color: '#ffc658' },
		{ name: 'Books', value: 10, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	],
	[
		{ name: 'Electronics', value: 30, color: '#8884d8' },
		{ name: 'Clothing', value: 20, color: '#82ca9d' },
		{ name: 'Food', value: 25, color: '#ffc658' },
		{ name: 'Books', value: 15, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	],
	[
		{ name: 'Electronics', value: 40, color: '#8884d8' },
		{ name: 'Clothing', value: 30, color: '#82ca9d' },
		{ name: 'Food', value: 10, color: '#ffc658' },
		{ name: 'Books', value: 10, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	],
	[
		{ name: 'Electronics', value: 33, color: '#8884d8' },
		{ name: 'Clothing', value: 22, color: '#82ca9d' },
		{ name: 'Food', value: 23, color: '#ffc658' },
		{ name: 'Books', value: 12, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	],
	[
		{ name: 'Electronics', value: 28, color: '#8884d8' },
		{ name: 'Clothing', value: 27, color: '#82ca9d' },
		{ name: 'Food', value: 22, color: '#ffc658' },
		{ name: 'Books', value: 13, color: '#ff7300' },
		{ name: 'Others', value: 10, color: '#00ff88' },
	],
];

const mockRecentTransactionsArray = [
	[
		{ id: 1, product: 'iPhone 13', customer: 'John Doe', amount: 999, date: '2024-01-15', status: 'completed' },
		{ id: 2, product: 'Samsung TV', customer: 'Jane Smith', amount: 799, date: '2024-01-15', status: 'pending' },
		{ id: 3, product: 'Nike Shoes', customer: 'Bob Johnson', amount: 129, date: '2024-01-14', status: 'completed' },
		{ id: 4, product: 'Dell Laptop', customer: 'Alice Brown', amount: 1299, date: '2024-01-14', status: 'completed' },
		{ id: 5, product: 'Coffee Maker', customer: 'Charlie Wilson', amount: 89, date: '2024-01-13', status: 'cancelled' },
	],
	[
		{ id: 6, product: 'Headphones', customer: 'Emma White', amount: 199, date: '2024-01-16', status: 'completed' },
		{ id: 7, product: 'Bluetooth Speaker', customer: 'Liam Gray', amount: 149, date: '2024-01-16', status: 'pending' },
		{ id: 8, product: 'Keyboard', customer: 'Noah Black', amount: 99, date: '2024-01-15', status: 'completed' },
		{ id: 9, product: 'Desk Lamp', customer: 'Olivia Green', amount: 45, date: '2024-01-14', status: 'completed' },
		{ id: 10, product: 'Tablet', customer: 'Ava Blue', amount: 299, date: '2024-01-13', status: 'cancelled' },
	],
	[
		{ id: 11, product: 'Smartwatch', customer: 'Sophia Red', amount: 250, date: '2024-01-17', status: 'completed' },
		{ id: 12, product: 'Printer', customer: 'Mason Pink', amount: 399, date: '2024-01-16', status: 'pending' },
		{ id: 13, product: 'Monitor', customer: 'Logan Cyan', amount: 220, date: '2024-01-15', status: 'completed' },
		{ id: 14, product: 'Router', customer: 'Lucas Indigo', amount: 80, date: '2024-01-14', status: 'completed' },
		{ id: 15, product: 'VR Headset', customer: 'Ella Violet', amount: 499, date: '2024-01-13', status: 'cancelled' },
	],
	[
		{ id: 16, product: 'Drone', customer: 'Logan Steel', amount: 799, date: '2024-01-18', status: 'completed' },
		{ id: 17, product: 'Camera', customer: 'Chloe Gold', amount: 1099, date: '2024-01-17', status: 'pending' },
		{ id: 18, product: 'Microwave', customer: 'Zoe Brown', amount: 250, date: '2024-01-16', status: 'completed' },
		{ id: 19, product: 'Watch', customer: 'Jack Silver', amount: 150, date: '2024-01-15', status: 'completed' },
		{ id: 20, product: 'Backpack', customer: 'Harper White', amount: 90, date: '2024-01-14', status: 'cancelled' },
	],
	[
		{ id: 21, product: 'Fan', customer: 'Luna Bronze', amount: 70, date: '2024-01-19', status: 'completed' },
		{ id: 22, product: 'Smart Light', customer: 'Leo Flame', amount: 40, date: '2024-01-18', status: 'pending' },
		{ id: 23, product: 'Vacuum', customer: 'Mila Sky', amount: 300, date: '2024-01-17', status: 'completed' },
		{ id: 24, product: 'Sofa', customer: 'Benjamin Cloud', amount: 600, date: '2024-01-16', status: 'completed' },
		{ id: 25, product: 'Mattress', customer: 'Abigail Rain', amount: 350, date: '2024-01-15', status: 'cancelled' },
	],
];

const mockDashboardDataArray = [
    { totalRevenue: 12250, monthlyGrowth: 5, totalProducts: 50, lowStockItems: 5},
    { totalRevenue: 16500, monthlyGrowth: 10, totalProducts: 75, lowStockItems: 10},
    { totalRevenue: 20750, monthlyGrowth: 15, totalProducts: 100, lowStockItems: 15},
    { totalRevenue: 25000, monthlyGrowth: 20, totalProducts: 125, lowStockItems: 20},
    { totalRevenue: 29250, monthlyGrowth: 25, totalProducts: 150, lowStockItems: 25},
]

export { mockCategoryDataArray, mockSalesDataArray, mockRecentTransactionsArray, mockDashboardDataArray };
