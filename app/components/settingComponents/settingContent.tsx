export default function SettingContent() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <p className="font-black text-xl mb-2">時計形式</p>
        <select className="border rounded-lg p-2 w-full">
          <option value="24">24時間形式</option>
          <option value="12">12時間形式 (AM/PM)</option>
        </select>
      </div>

      <div className="mb-6">
        <p className="font-black text-xl mb-2">言語</p>
        <select className="border rounded-lg p-2 w-full">
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="it">Italiano</option>
        </select>
      </div>
    </div>
  );
}
