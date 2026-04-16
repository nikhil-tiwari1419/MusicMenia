const userModel = require('../models/user.model');

//Get All Users - Admin Only 
async function getAllusers(req, res) {
    try {
        const users = await userModel
            .find()
            .select('-password')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: users.length,
            users,
        });
    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

//PATCH promot user-> artist
async function promoteToArtist(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userId.role === "admin") {
            return res.status(400).json({ message: "Cannot change roel of an admin" });
        }

        if (userId.role === "artist") {
            return res.status(400).json({ message: "user is already an artist" });
        }

        const updateUser = await userModel.findByIdAndUpdate(
            userId,
            { role: 'artist' },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: `${updateUser.username} has been prometed to artist`,
            user: updateUser,
        })
    } catch (error) {
        console.error("Promote User Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}
//PATCH demote artist -> user
async function demoteToUser(req, res) {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot change role of an Admin" });
        }

        if (user.role === "user") {
            return res.status(400).json({ message: "User is already a reguler user" });
        }

        const updateuser = await userModel.findByIdAndUpdate(
            userId,
            { role: "user" },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: `${updateuser.username} has been demoted to user`,
            user: updateuser,
        });

    } catch (error) {
        console.error("Demote User Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }

}
//DELETE user - Admin Only Can remove non-admin users
async function deleteUser(req,res){

    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        if(user.role === "admin"){
            return res.status(400).json({ message: "Cannot delete an admin user" });
        }

        await userModel.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: `${user.username} has been deleted successfully`
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { getAllusers, promoteToArtist, demoteToUser, deleteUser };

