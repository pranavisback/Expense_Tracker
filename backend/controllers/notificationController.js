import Notification from '../models/Notification.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('sender', 'name email avatar')
      .populate('data.groupId', 'name type')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      data: { notifications, unreadCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.id },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const respondToGroupInvite = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user.id,
      type: 'group_invite'
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    if (action === 'accept') {
      // Add user to group
      const group = await Group.findById(notification.data.groupId);
      if (group) {
        const isAlreadyMember = group.members.some(
          member => member.user.toString() === req.user.id
        );
        
        if (!isAlreadyMember) {
          group.members.push({ user: req.user.id, role: 'member' });
          await group.save();
        }
      }
    }

    // Update notification status
    notification.status = action === 'accept' ? 'accepted' : 'rejected';
    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: `Group invite ${action}ed successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createGroupInviteNotification = async (senderId, recipientId, groupId) => {
  try {
    const sender = await User.findById(senderId);
    const group = await Group.findById(groupId);
    
    if (!sender || !group) return;

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: 'group_invite',
      title: 'Group Invitation',
      message: `${sender.name} invited you to join "${group.name}"`,
      data: { groupId }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};