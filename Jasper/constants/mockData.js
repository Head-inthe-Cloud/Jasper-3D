export const users = {
	u00001: {
		userId: "u00001",
		email: "12345@uw.edu",
		userName: "Joy",
		avatar: "https://i.ibb.co/b755bN5/avatar2.png",
		uw: true,
		rating: 5.0,
		paymentOptions:["PayPal", "Venmo", "WeChat", "Zelle"],
		interests: ["Furniture", "Electronics"],
		savedItems: ["i00005", "i00010"],
		postedItems: ["i00001", "i00002", "i00003", "i00004"],
		intro: "I am a third year undergraduate at UW, I study Math and Philosophy. I have a bunny called Bailey and I love painting!",
		location: "U-district"
	},
	u00002: {
		userId: "u00002",
		email: "9876@uw.edu",
		userName: "David",
		avatar: "https://i.ibb.co/3R6Y3pb/avatar1.png",
		uw: true,
		rating: 5.0,
		paymentOptions:["Venmo", "Zelle"],
		interests: ["Furniture", "Electronics"],
		savedItems: ["i00001", "i00002", "i00009"],
		postedItems: ["i00005", "i00006", "i00007"]
	},
	u00003: {
		userId: "u00003",
		email: "23456@uw.edu",
		userName: "Josh",
		avatar: "https://i.ibb.co/JKPPkcv/avatar3.png",
		uw: false,
		rating: 4.5,
		paymentOptions:["PayPal", "Venmo"],
		interests: ["Fashion", "Sports"],
		savedItems: ["i00003", "i00005"],
		postedItems: ["i00008", "i00009", ]
	},
	u00004: {
		userId: "u00004",
		email: "newDawg@uw.edu",
		userName: "Billy",
		avatar: "https://i.ibb.co/QbMKBGC/Avatars-Default-with-Backdrop.png",
		uw: false,
		rating: 5.0,
		paymentOptions:["PayPal", "Venmo"],
		interests: ["Fashion", "Sports"],
		savedItems: ["i00003", "i00005"],
		postedItems: ["i00010"]
	},
};

export const conversations = {
	101010: {
		conversationId: "101010",
		participants: ["u00001", "u00002"],
		createdAt: "2021-04-23T18:25:43.511Z",
		updatedAt: "2021-04-23T18:45:43.511Z",
		itemId: "i00001",
		tradeEnded: true,
		messages: [
			{
				time: "2021-04-23T18:25:43.511Z", 
				contentType: "text",  
				content: "Hello Joy, I am very interested in the chair, what is a good time to pick this up?",
				userId: "u00002",
			},
			{
				time: "2021-04-23T18:45:43.511Z",
				contentType: "text",  
				content: "Hello David, I am free all week. When do you prefer?",
				userId: "u00001",
			},
			{
				time: "2021-04-23T18:55:43.511Z",   // ISO Dates
				contentType: "text",  
				content: "Great, can I pick it up at Red Square at 2PM tomorrow?",
				userId: "u00002",
			},
			{
				time: "2021-04-23T19:00:43.511Z",   // ISO Dates
				contentType: "text",  
				content: "No problem.",
				userId: "u00001",
			},
			{
				time: "2021-04-23T19:05:43.511Z",   // ISO Dates
				contentType: "text",  
				content: "The chair is really nice, thank you.",
				userId: "u00002",
			},
			{
				time: "2021-04-23T19:00:43.511Z",   // ISO Dates
				contentType: "paymentInfo",  
				content: "Venmo",
				userId: "u00001",
			},
		],
	},
	101011: {
		conversationId: "101011",
		participants: ["u00001", "u00003"],
		createdAt: "2021-04-23T18:25:43.511Z",
		updatedAt: "2021-04-23T18:45:43.511Z",
		itemId: "i00009",
		tradeEnded: true,
		messages: [
			{
				time: "2021-04-23T18:25:43.511Z",   // ISO Dates
				contentType: "text",  
				content: "Hi Josh, I like this yoga mat a lot, what brand is it?",
				userId: "u00001",
			},
			{
				time: "2021-04-23T18:45:43.511Z",
				contentType: "text",  
				content: "Hello Joy, it's a Gaiam yoga mat.",
				userId: "u00003",
			},
			{
				time: "2021-04-23T18:45:43.511Z",
				contentType: "text",  
				content: "Great, see you at Red Square.",
				userId: "u00001",
			},
			{
				time: "2021-04-23T18:55:43.511Z",
				contentType: "paymentInfo",  
				content: "PayPal",
				userId: "u00003",
			},
			{
				time: "2021-04-23T18:56:43.511Z",
				contentType: "text",  
				content: "Thank you! Love the yoga mat",
				userId: "u00001",
			},
		],
	},
};

export const items = {
	i00001: {
		itemId: "i00001",
		title: "Black IKEA chair",
		sellerId: "u00001",
		createDate: "2022-04-25",
		condition: "Brand New",
		description:
			"Black IKEA chair in good condition, used for a year. I am graudating from UW and moving out. You can pick this up at anytime in the day.",
		images: [
			"https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80",
			"https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
		],
		price: 25,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00002: {
		itemId: "i00002",
		title: "iMac with Keyboard and Mouse",
		sellerId: "u00001",
		createDate: "2022-04-24",
		condition: "Brand New",
		description:
			"One and a half year old iMac, comes with Apple keyboard and Apple mouse",
		images: [
			"https://images.unsplash.com/photo-1588200908342-23b585c03e26?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
		],
		price: 700,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00003: {
		itemId: "i00003",
		title: "LANCOME Lipstick",
		sellerId: "u00001",
		createDate: "2022-04-23",
		condition: "Brand New",
		description:
			"Brand new, I accidently bought the wrong color and never used it.",
		images: [
			"https://images.unsplash.com/photo-1619352520578-8fefbfa2f904?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
		],
		price: 20,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00004: {
		itemId: "i00004",
		title: "Comfy Hoodie",
		sellerId: "u00001",
		createDate: "2022-04-22",
		condition: "Brand New",
		description: "Nice comfy hoodie, 90% new",
		images: [
			"https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1072&q=80",
		],
		price: 20,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00005: {
		itemId: "i00005",
		title: "Bowls and Forks",
		sellerId: "u00002",
		createDate: "2022-04-21",
		condition: "Brand New",
		description: "Selling some old utencils",
		images: [
			"https://images.unsplash.com/photo-1577576308052-4c4f724ce7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
		],
		price: 15,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00006: {
		itemId: "i00006",
		sellerId: "u00002",
		createDate: "2022-04-20",
		condition: "Brand New",
		title: "Blue Heart Earings",
		description: "Pretty Earings, looks good with any clothes",
		images: [
			"https://images.unsplash.com/photo-1630019852942-f89202989a59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=446&q=80",
		],
		price: 30,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00007: {
		itemId: "i00007",
		sellerId: "u00002",
		createDate: "2022-04-19",
		condition: "Brand New",
		title: "Small Nightstand",
		description: "Lightweight Wooden nightstand",
		images: [
			"https://assets.weimgs.com/weimgs/ab/images/wcm/products/202146/0234/margot-raffia-nightstand-2-c.jpg",
		],
		price: 25,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00008: {
		itemId: "i00008",
		sellerId: "u00003",
		createDate: "2022-04-18",
		condition: "Brand New",
		title: "PS4 Game Disks",
		description: "50% off for all games, send me a message for price",
		images: [
			"https://media-exp1.licdn.com/dms/image/C4E1BAQEDQeEhWurHog/company-background_10000/0/1519800213882?e=2147483647&v=beta&t=XCM5XgwsIIpM1O6DA2tsKBL719ixAayObx1EH0CumdI",
		],
		price: 20,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00009: {
		itemId: "i00009",
		sellerId: "u00003",
		createDate: "2022-04-17",
		condition: "Brand New",
		title: "Yoga Mat",
		description: "Fairly clean yoga mat",
		images: [
			"https://m.media-amazon.com/images/I/81mao7QZ1iL._AC_SL1500_.jpg",
		],
		price: 10,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
	i00010: {
		itemId: "i00010",
		sellerId: "u00004",
		createDate: "2022-04-16",
		condition: "Brand New",
		title: "30 LB Dog Food",
		description: "Unopend dog food",
		images: ["https://s7d2.scene7.com/is/image/PetSmart/5278693"],
		price: 30,
		pickUpLocation: "Red Square",
		dropOff: "False",
		UWvisibility: "True",
		negotiable: "True"
	},
};
