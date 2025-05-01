<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel App - README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            color: #333;
            margin: 0;
            padding: 0;
        }

        header {
            background-color: #2d3b6d;
            color: white;
            padding: 20px;
            text-align: center;
        }

        header h1 {
            margin: 0;
        }

        .section {
            margin: 20px;
            padding: 15px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .section h2 {
            color: #2d3b6d;
        }

        .section ul {
            list-style-type: none;
            padding-left: 20px;
        }

        .section ul li {
            padding: 5px 0;
        }

        .section a {
            color: #2d3b6d;
            text-decoration: none;
        }

        .section a:hover {
            text-decoration: underline;
        }

        code {
            background-color: #f0f0f0;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: Consolas, monospace;
        }

        .highlight {
            color: #2d3b6d;
        }

        footer {
            background-color: #2d3b6d;
            color: white;
            text-align: center;
            padding: 15px;
            margin-top: 40px;
        }

        footer a {
            color: white;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>

    <header>
        <h1>Welcome to Your Travel App 🚀</h1>
        <p>Built with Expo</p>
    </header>

    <div class="section">
        <h2>Get Started</h2>
        <p>1. <strong>Install dependencies</strong></p>
        <pre><code>npm install</code></pre>
        <p>2. <strong>Start the app</strong></p>
        <pre><code>npx expo start</code></pre>
        <p>In the output, you'll find options to open the app in:</p>
        <ul>
            <li><a href="https://docs.expo.dev/develop/development-builds/introduction/" target="_blank">Development Build</a></li>
            <li><a href="https://docs.expo.dev/workflow/android-studio-emulator/" target="_blank">Android Emulator</a></li>
            <li><a href="https://docs.expo.dev/workflow/ios-simulator/" target="_blank">iOS Simulator</a></li>
            <li><a href="https://expo.dev/go" target="_blank">Expo Go</a>, a sandbox for trying out app development</li>
        </ul>
    </div>

    <div class="section">
        <h2>Project Overview</h2>
        <p>This is a travel app that helps users plan trips. It features:</p>
        <ul>
            <li><strong>Mood Boards:</strong> Helps users set a mood for their trips.</li>
            <li><strong>Itinerary Creation:</strong> Users can create and view trip itineraries.</li>
            <li><strong>Community:</strong> Solo travelers can interact and share trip experiences.</li>
            <li><strong>AI Itinerary:</strong> Suggests itineraries based on user preferences.</li>
        </ul>
        <p>The app is built using React Native and Expo, with Firebase as the backend for storing user data.</p>
    </div>

    <div class="section">
        <h2>Get a Fresh Project</h2>
        <p>When you're ready to start fresh or reset the project, use the following command:</p>
        <pre><code>npm run reset-project</code></pre>
        <p>This will move the current code to a backup directory and create a clean slate for you to start developing.</p>
    </div>

    <div class="section">
        <h2>Learn More</h2>
        <p>To learn more about developing your project with Expo, check out these helpful resources:</p>
        <ul>
            <li><a href="https://docs.expo.dev/" target="_blank">Expo Documentation</a>: Learn the fundamentals or dive into advanced topics with our <a href="https://docs.expo.dev/guides" target="_blank">guides</a>.</li>
            <li><a href="https://docs.expo.dev/tutorial/introduction/" target="_blank">Learn Expo Tutorial</a>: A step-by-step tutorial to create an app that works on Android, iOS, and the web.</li>
        </ul>
    </div>

    <div class="section">
        <h2>Join the Community</h2>
        <p>Join the vibrant Expo community of developers creating universal apps:</p>
        <ul>
            <li><a href="https://github.com/expo/expo" target="_blank">Expo on GitHub</a>: View our open-source platform and contribute.</li>
            <li><a href="https://chat.expo.dev" target="_blank">Expo Discord Community</a>: Chat with Expo users and ask questions.</li>
        </ul>
    </div>

    <footer>
        <p>Happy Coding and Enjoy Building Your Travel App! ✈️🌍</p>
        <p><a href="https://expo.dev" target="_blank">Learn more about Expo</a></p>
    </footer>

</body>

</html>
