export default function Login() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="min-w-[450px] min-h-[600px] bg-white shadow-lg rounded-md p-10">
				<h2 className="text-center mb-10 font-semibold text-2xl">ログイン</h2>
				<input
					className="border border-gray-800 w-full h-12"
					type="text"
					placeholder="メールアドレス"
				/>
				<input
					className="border border-gray-800 w-full h-12"
					type="text"
					placeholder="メールアドレス"
				/>
			</div>
		</div>
	);
}
