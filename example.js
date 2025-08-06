// Example of using the Figma MCP server
// 
// To use this server, you need:
// 1. A Figma Personal Access Token (get it from Figma Account Settings)
// 2. A Figma file key (from the file URL)
// 3. Optional: Team ID for team operations

// Example Figma file URL:
// https://www.figma.com/file/ABC123XYZ/My-Design-File
// The file key would be: ABC123XYZ

// The MCP server provides these tools:
// 
// 1. get_file - Retrieves full file data
//    Required: fileKey, token
//
// 2. get_file_nodes - Gets specific nodes from a file
//    Required: fileKey, nodeIds (array), token
//
// 3. get_team_projects - Lists all projects in a team
//    Required: teamId, token

// Example usage in Claude:
// "Use the figma MCP server to get file data for file key ABC123XYZ with token YOUR_TOKEN"

console.log('Figma MCP Server is ready to use!');
console.log('Available tools:');
console.log('- get_file');
console.log('- get_file_nodes'); 
console.log('- get_team_projects');