export function formatUser(userDoc, matchCount = 0) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    bio: userDoc.bio,
    location: userDoc.location,
    profilePic: userDoc.profileImage,
    skillsOffered: userDoc.skillsOffered,
    skillsWanted: userDoc.skillsWanted,
    createdAt: userDoc.createdAt,
    matchCount,
  };
}

export function formatSwap(swapDoc) {
  return {
    id: swapDoc._id.toString(),
    senderId: swapDoc.sender._id.toString(),
    receiverId: swapDoc.receiver._id.toString(),
    senderName: swapDoc.sender.name,
    senderPic: swapDoc.sender.profileImage,
    receiverName: swapDoc.receiver.name,
    receiverPic: swapDoc.receiver.profileImage,
    skillOffered: swapDoc.skillOffered,
    skillRequested: swapDoc.skillRequested,
    status: swapDoc.status,
    message: swapDoc.message,
    createdAt: swapDoc.createdAt,
    updatedAt: swapDoc.updatedAt,
  };
}

export function formatPost(postDoc, currentUserId) {
  return {
    id: postDoc._id.toString(),
    userId: postDoc.user._id.toString(),
    userName: postDoc.user.name,
    userPic: postDoc.user.profileImage,
    skillWanted: postDoc.skillWanted,
    description: postDoc.description,
    createdAt: postDoc.createdAt,
    responses: postDoc.responses,
    likes: postDoc.likedBy.length,
    isLiked: currentUserId ? postDoc.likedBy.some((id) => id.toString() === currentUserId) : false,
    isSaved: currentUserId ? postDoc.savedBy.some((id) => id.toString() === currentUserId) : false,
  };
}

export function formatNotification(notificationDoc) {
  return {
    id: notificationDoc._id.toString(),
    type: notificationDoc.type,
    title: notificationDoc.title,
    body: notificationDoc.body,
    read: notificationDoc.read,
    avatar: notificationDoc.avatar || undefined,
    createdAt: notificationDoc.createdAt,
  };
}
