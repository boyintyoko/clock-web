import {supabase} from "@/lib/supabase"; // あなたのパスに合わせて

export async function saveSettings(settings: {
  background?: string;
  timezone?: string;
  dark_mode?: boolean;
}) {
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("ユーザーいない");
    return;
  }

  const {error} = await supabase
    .from("settings")
    .upsert({
      user_id: user.id,
      ...settings,
    });

  if (error) {
    console.error("settings保存失敗:", error);
  } else {
    console.log("settings保存成功");
  }
}
