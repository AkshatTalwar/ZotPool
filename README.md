## Inspiration
Being an Indian international student living in Singapore, every holiday came with a challenge. Traveling alone, especially on long trips, always felt boring and lonely. On top of that, the money I spent on Ubers to get to the airport or bus stations burned a hole in my pocket. I often wished I had someone to share rides with or travel together, but I didn’t know how to find the right people. That’s when the idea of ZotPool came to me—to help others like me connect with travel buddies, save money, and make trips more fun and social.


## What it does
ZotPool is designed to make student travel more affordable, social, and stress-free. It offers two main features:

1. Carpool Finder:
Students can find ride-sharing options by entering their starting and ending points, travel date and time, luggage details, and preferences for group size. The app matches users with others traveling in the same direction, allowing them to share costs while making new friends.

2. Travel Buddy Finder:
For long-distance travel, students can find companions for flights, trains, or buses. Users provide travel details like origin, destination, and transport information (e.g., flight or bus numbers). With personality sliders for traits such as quietness, extroversion, and humor, users can ensure they are matched with people who suit their preferences.

ZotPool is more than just a travel tool—it helps students save money, meet like-minded peers, and create memorable journeys.

## How we built it
I built ZotPool using Next.js for a fast, modern, and scalable web application. Clerk was integrated for secure user authentication, ensuring a seamless login experience. The interactive interface was crafted using React for dynamic components and Tailwind CSS for clean and responsive styling. For the Travel Buddy feature, we integrated Google Maps Autocomplete to simplify location selection. To generate user matches, we leveraged the OpenAI API to simulate realistic outputs based on user preferences and personality traits. This blend of modern technologies and AI ensured that ZotPool is intelligent, efficient, and user-focused.

## Challenges we ran into
The major challenge I faced was building the model that powers the algorithm for matching users. This involved calculating distances between locations using latitude and longitude to ensure the output options were within a 1-mile radius. Converting this logic into mathematical formulas and integrating it with an LLM-powered matching system required significant effort. On top of that, incorporating the Google Maps API for location autocomplete and ensuring it worked seamlessly with our custom algorithm was technically demanding

## Accomplishments that we're proud of
I am proud of building a functional platform that combines real-world tools like Google Maps API with advanced algorithms to create meaningful matches for travelers. Successfully integrating an LLM-powered recommendation system with real-time location-based filtering was a significant achievement. Additionally, designing an intuitive and user-friendly interface while ensuring the app handles diverse user needs was no small feat.

## What we learned
This was my first hackathon, and it taught me so much about building a project under a strict timeline. Learning to use APIs, like Google Maps, and creating a working AI model for matching travelers was a valuable experience. It gave me practical insight into integrating technical tools and frameworks while working efficiently as part of a competition. This experience has sharpened my skills and boosted my confidence to tackle more complex challenges in the future.

## What's next for ZotPool - Save Costs, Make Friends, Travel Together!
The next step for ZotPool is to create a fully functional mobile application with an intuitive and gamified user interface. The focus will be on enhancing the user experience to make it more personal, engaging, and accessible. Additionally, we aim to improve the accuracy of information by refining the AI model and integrating more data sources, ensuring a seamless and enjoyable experience for users. This mobile app will make ZotPool even more convenient for students and travelers worldwide.
