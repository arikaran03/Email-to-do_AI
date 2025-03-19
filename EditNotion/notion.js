import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API_URL = "https://api.notion.com/v1";
const HEADERS = {
  "Authorization": `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};
async function createPage(title, description) {
  const response = await fetch(`${NOTION_API_URL}/pages`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Details: { rich_text: [{ text: { content: description } }] }
      }
    }),
  });

  const data = await response.json();
  console.log("Created Page:", data);
}
async function updatePage(pageId, newTitle) {
  const response = await fetch(`${NOTION_API_URL}/pages/${pageId}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        Name: { title: [{ text: { content: newTitle } }] }
      }
    }),
  });
  const data = await response.json();
  console.log("Updated Page:", data);
}
createPage("Ari", "This is a test page-5.");