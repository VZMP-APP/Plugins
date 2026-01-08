import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

let patches = [];

// Initialize default storage values
storage.enabled ??= true;
storage.customText ??= `-# This user is suspected of conducting spy activities for the Russian Federation • [Learn more](<https://support.discord.com/hc/en-us>)
-# This user is under the supervision of the BKA • [Review](<https://www.bka.de/DE/Home/home_node.html>)
-# This user needs to get tormented by a Dominant Female by her feet • [DM NOW](<https://discordapp.com/users/1016016621397090384>)`;
storage.spacePadding ??= 69; // Number of spaces to add

export default {
  onLoad() {
    const MessageActions = findByProps("sendMessage");
    
    if (!MessageActions) {
      console.error("Failed to find MessageActions module");
      return;
    }

    patches.push(
      before("sendMessage", MessageActions, (args) => {
        if (!storage.enabled) return;
        
        const [channelId, message] = args;
        
        if (!message || !message.content) return;
        
        // Don't modify if message already contains our marker
        if (message.content.includes(storage.customText)) return;
        
        // Create the padding spaces
        const spaces = " ".repeat(storage.spacePadding || 0);
        
        // Append spaces and custom text
        message.content = `${message.content}${spaces}\n${storage.customText}`;
      })
    );
  },

  onUnload() {
    for (const p of patches) {
      try { 
        p(); 
      } catch (e) {
        console.error("Error unloading patch:", e);
      }
    }
    patches = [];
  },
};
