// Notification utility functions

// Add a new notification to global.notifications
export const addNotification = (notification) => {
  if (!global.notifications) {
    global.notifications = [];
  }
  
  const newNotification = {
    id: Date.now(),
    time: new Date().toISOString(),
    read: false,
    ...notification
  };
  
  global.notifications.unshift(newNotification); // Add to beginning of array
  
  // Keep only last 50 notifications
  if (global.notifications.length > 50) {
    global.notifications = global.notifications.slice(0, 50);
  }
  
  return newNotification;
};

// Add a bid notification
export const addBidNotification = (car, bidAmount, bidderName) => {
  return addNotification({
    type: 'bid',
    car: car,
    bidAmount: bidAmount,
    bidderName: bidderName,
    title: `New bid on ${car.title}`,
    message: `Someone bid PKR ${bidAmount.toLocaleString()} on your car`
  });
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  if (global.notifications) {
    const notification = global.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => {
  if (global.notifications) {
    global.notifications.forEach(notification => {
      notification.read = true;
    });
  }
};

// Clear all notifications
export const clearAllNotifications = () => {
  global.notifications = [];
};

// Remove a specific notification by index
export const removeNotification = (index) => {
  if (global.notifications && global.notifications.length > index) {
    global.notifications.splice(index, 1);
  }
};

// Get unread notification count
export const getUnreadNotificationCount = () => {
  if (!global.notifications) return 0;
  return global.notifications.filter(notification => !notification.read).length;
};

// Get notifications for a specific car
export const getNotificationsForCar = (carId) => {
  if (!global.notifications) return [];
  return global.notifications.filter(notification => notification.car?.id === carId);
};

// Add sample notifications for testing
export const addSampleNotifications = () => {
  const sampleCar = {
    id: 1,
    title: 'Suzuki Alto VXL AGS',
    price: 'PKR 2,800,000'
  };
  
  addBidNotification(sampleCar, 2500000, 'Ahmed Khan');
  addBidNotification(sampleCar, 2600000, 'Fatima Ali');
  addBidNotification(sampleCar, 2700000, 'Muhammad Hassan');
  
  // Add some other types of notifications
  addNotification({
    type: 'promotion',
    title: 'Promotion Applied!',
    message: 'Your car listing now has FEATURED promotion'
  });
  
  addNotification({
    type: 'message',
    title: 'New Message',
    message: 'Someone sent you a message about your car'
  });
}; 