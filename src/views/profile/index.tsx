import { useState, useEffect } from "react";
import ProfileSidebar from "./sidebar";
import ProfileContent from "./content";
import userAPI from "../../api/userAPI";
import { useAuth } from "../../contexts/AccountContext";

interface UserInfo {
  fullname: string;
  birthday: string;
  sex: boolean;
  level: number;
  demand: string;
}

export default function ProfilePage() {
  const { account, setAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "intro" | "activities" | "security"
  >("intro");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.get();
        if (res.status === 200) {
          const d = res.data.data;
          setUsername(d.username);
          setAvatar(d.avatar);
          setIsVerified(d.verified);
          setUserInfo({
            fullname: d.fullname,
            birthday: d.birthday.split("T")[0],
            sex: d.sex,
            level: d.level,
            demand: d.demand,
          });
          // đồng bộ account context
          setAccount({
            ...account,
            username: d.username,
            avatar: d.avatar,
            verified: d.verified,
          });
          localStorage.setItem(
            "user_info",
            JSON.stringify({
              ...account,
              username: d.username,
              avatar: d.avatar,
              verified: d.verified,
            })
          );
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = async (data: UserInfo) => {
    try {
      const res = await userAPI.update(data);
      if (res.status === 200) {
        setUserInfo(data);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      await userAPI.updatePassword({ currentPassword, newPassword });
    } catch (err) {
      console.error("Error changing password:", err);
      throw err;
    }
  };

  const handleUserNameChange = async (newUserName: string) => {
    try {
      const res = await userAPI.updateUsername(newUserName);
      if (res.status === 200) {
        setUsername(newUserName);
        // cập nhật context + localStorage
        const updated = { ...account, username: newUserName };
        setAccount(updated);
        localStorage.setItem("user_info", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      const res = await userAPI.uploadImage(file);
      if (res.status === 200) {
        const newAvatar = res.data.data;
        setAvatar(newAvatar);
        // cập nhật context + localStorage
        const updated = { ...account, avatar: newAvatar };
        setAccount(updated);
        localStorage.setItem("user_info", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userAvatar={avatar}
            userName={username}
            isVerified={isVerified}
            onUserNameChange={handleUserNameChange}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        <div className="md:col-span-2">
          <ProfileContent
            activeTab={activeTab}
            userInfo={userInfo}
            onUpdateUser={handleUpdateUser}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>
    </div>
  );
}
