interface ImageType {
	id: string;
	urls: {
		full: string;
		thumb: string;
		regular: string;
	};
	user: {
		id: string;
		username: string;
		name: string;
		portfolio_url: string | null;
		profile_image: {
			small: string;
			medium: string;
			large: string;
		};
		links: {
			self: string;
			html: string;
			photos: string;
			likes: string;
		};
	};
}

export default ImageType;
