import { Calendar, Image, Smile } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../../services/apiService";

function TweetComposer({ onTweet }) {
	const [tweetText, setTweetText] = useState('');
	const maxChars = 280;
	const { user } = useAuth();

	const [errorMessage, setErrorMessage] = useState("")

	const handleSubmit = async () => {
		setErrorMessage("")
		const formData = {
			content: tweetText
		}
		try {
			const res = await api.post("/tweets/", formData, {
				headers: "application/json"
			})

			if(res) window.location.reload()
		} catch (error) {
			setErrorMessage("Error creating tweet")
		}
	};

	const remainingChars = maxChars - tweetText.length;
	const progressPercent = (tweetText.length / maxChars) * 100;

	return (
		<div className="border-b border-gray-200 p-4">
			<div className="flex gap-3">
				<img
					src={user?.avatar}
					alt={user.username}
					className="w-12 h-12 rounded-full object-cover"
				/>

				<div className="flex-1">
					<textarea
						value={tweetText}
						onChange={(e) => setTweetText(e.target.value)}
						placeholder="What's happening?"
						className="w-full text-xl outline-none resize-none placeholder-gray-500"
						rows="3"
						maxLength={maxChars}
					/>

					<div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
						<div className="flex items-center gap-3">
							{tweetText.length > 0 && (
								<div className="flex items-center gap-2">
									<svg className="w-8 h-8 -rotate-90">
										<circle
											cx="16"
											cy="16"
											r="14"
											stroke="#e5e7eb"
											strokeWidth="3"
											fill="none"
										/>
										<circle
											cx="16"
											cy="16"
											r="14"
											stroke={remainingChars < 20 ? '#ef4444' : '#1d9bf0'}
											strokeWidth="3"
											fill="none"
											strokeDasharray={`${progressPercent * 0.88} ${100 * 0.88}`}
											className="transition-all"
										/>
									</svg>
									{remainingChars < 20 && (
										<span className={`text-sm ${remainingChars < 0 ? 'text-red-600' : 'text-gray-500'}`}>
											{remainingChars}
										</span>
									)}
								</div>
							)}

							<button
								onClick={handleSubmit}
								disabled={!tweetText.trim() || remainingChars < 0}
								className={`px-5 py-2 rounded-full font-bold transition ${tweetText.trim() && remainingChars >= 0
									? 'bg-blue-500 hover:bg-blue-600 text-white'
									: 'bg-blue-300 text-white cursor-not-allowed'
									}`}
							>
								Tweet
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TweetComposer;