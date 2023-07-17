# flowChat
FlowChat enables users to communicate with each other through two distinct methods: Chats and Channels.

Chats facilitate the exchange of various types of messages, including text, voice, and pictures, among individuals. This feature is exclusively accessible to parties involved in the conversation.

Channels, on the other hand, can be either public or private. Both types of channels are stored as resources with specific storage paths.
Public channels allow anyone to join by utilizing its unique identification code. On the contrary, private channels require a subscription fee, determined by the channel administrator, to be paid by individuals seeking access

# Main Features
- serverless: the application is completely serverless and fully decentralized thanks to Flow
- flow profile support: FlowChat supports flow profile contract
- chats: supports p2p chat
- channels: supports public and paid channels
- web Application (SPA): the frontend is design using React framework and after first installation doesnt need to interact with front server
- support different file type: FlowChat supports voice, picture and file as attachment
- special voice encoding: FlowChat use Opus codec for ultra compression voice which supports in iphone too
 
# Demo
Demo of flowChat can be found on https://flowchat.cuttlas.app

# Install
## SmartContract
start the flow project using 
`flow init`

deploy the contract using
`flow project deploy`

## frontEnd
To install the package

`npm i`
In the project directory, you can run:

`npm start`
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

`npm test`
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

`npm run build`
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
