// src/actions/upload.ts
import {
  ModelClass,
  generateObject
} from "@elizaos/core";
import { Indexer, ZgFile, getFlowContract } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import { composeContext } from "@elizaos/core";
import { promises as fs } from "fs";

// src/templates/upload.ts
var uploadTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "filePath": null,
    "description": "I want to upload a file"
}
\`\`\`

{{recentMessages}}

Extract the user's intention to upload a file from the conversation. Users might express this in various ways, such as:
- "I want to upload a file"
- "upload an image"
- "send a photo"
- "upload"
- "let me share a file"

If the user provides any specific description of the file, include that as well.

Respond with a JSON markdown block containing only the extracted values.`;

// src/actions/upload.ts
function isUploadContent(_runtime, content) {
  console.log("Content for upload", content);
  return typeof content.filePath === "string";
}
var zgUpload = {
  name: "ZG_UPLOAD",
  similes: [
    "UPLOAD_FILE_TO_ZG",
    "STORE_FILE_ON_ZG",
    "SAVE_FILE_TO_ZG",
    "UPLOAD_TO_ZERO_GRAVITY",
    "STORE_ON_ZERO_GRAVITY",
    "SHARE_FILE_ON_ZG",
    "PUBLISH_FILE_TO_ZG"
  ],
  description: "Store data using 0G protocol",
  validate: async (runtime, message) => {
    const zgIndexerRpc = !!runtime.getSetting("ZEROG_INDEXER_RPC");
    const zgEvmRpc = !!runtime.getSetting("ZEROG_EVM_RPC");
    const zgPrivateKey = !!runtime.getSetting("ZEROG_PRIVATE_KEY");
    const flowAddr = !!runtime.getSetting("ZEROG_FLOW_ADDRESS");
    return zgIndexerRpc && zgEvmRpc && zgPrivateKey && flowAddr;
  },
  handler: async (runtime, message, state, _options, callback) => {
    console.log("ZG_UPLOAD action called");
    if (!state) {
      state = await runtime.composeState(message);
    } else {
      state = await runtime.updateRecentMessageState(state);
    }
    const uploadContext = composeContext({
      state,
      template: uploadTemplate
    });
    const content = await generateObject({
      runtime,
      context: uploadContext,
      modelClass: ModelClass.LARGE
    });
    if (!isUploadContent(runtime, content)) {
      console.error("Invalid content for UPLOAD action.");
      if (callback) {
        callback({
          text: "Unable to process 0G upload request. Invalid content provided.",
          content: { error: "Invalid upload content" }
        });
      }
      return false;
    }
    try {
      const zgIndexerRpc = runtime.getSetting("ZEROG_INDEXER_RPC");
      const zgEvmRpc = runtime.getSetting("ZEROG_EVM_RPC");
      const zgPrivateKey = runtime.getSetting("ZEROG_PRIVATE_KEY");
      const flowAddr = runtime.getSetting("ZEROG_FLOW_ADDRESS");
      const filePath = content.filePath;
      if (!filePath) {
        console.error("File path is required");
        return false;
      }
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error(
          `File ${filePath} does not exist or is not accessible:`,
          error
        );
        return false;
      }
      const file = await ZgFile.fromFilePath(filePath);
      var [tree, err] = await file.merkleTree();
      if (err === null) {
        console.log("File Root Hash: ", tree.rootHash());
      } else {
        console.log("Error getting file root hash: ", err);
        return false;
      }
      const provider = new ethers.JsonRpcProvider(zgEvmRpc);
      const signer = new ethers.Wallet(zgPrivateKey, provider);
      const indexer = new Indexer(zgIndexerRpc);
      const flowContract = getFlowContract(flowAddr, signer);
      var [tx, err] = await indexer.upload(
        file,
        0,
        zgEvmRpc,
        flowContract
      );
      if (err === null) {
        console.log("File uploaded successfully, tx: ", tx);
      } else {
        console.error("Error uploading file: ", err);
        return false;
      }
      await file.close();
    } catch (error) {
      console.error("Error getting settings for 0G upload:", error);
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "upload my resume.pdf file",
          action: "ZG_UPLOAD"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "can you help me upload this document.docx?",
          action: "ZG_UPLOAD"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "I need to upload an image file image.png",
          action: "ZG_UPLOAD"
        }
      }
    ]
  ]
};

// src/index.ts
var zgPlugin = {
  description: "ZeroG Plugin for Eliza",
  name: "ZeroG",
  actions: [zgUpload],
  evaluators: [],
  providers: []
};
export {
  zgPlugin
};
//# sourceMappingURL=index.js.map