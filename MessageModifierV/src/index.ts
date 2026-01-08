import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { ReactNative as RN } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";

const MessageActions = findByProps("sendMessage", "editMessage");

const DEFAULT_SUFFIX =
`(                                                                     )
-# This user is suspected of conducting spy activities for the Russian Federation • [Learn more](https://support.discord.com/hc/en-us)
-# This user is under the supervision of the BKA • [Review](https://www.bka.de/DE/Home/home_node.html)
-# This user needs to get tormented by a Dominant Female by her feet • [DM NOW](https://discordapp.com/users/1016016621397090384)`;

if (!storage.suffix) storage.suffix = DEFAULT_SUFFIX;

let unpatch;

export default {
  onLoad() {
      unpatch = before("sendMessage", MessageActions, (args) => {
            const [, message] = args;
                  if (!message?.content) return;

                        if (!message.content.includes(storage.suffix)) {
                                message.content += "\n" + storage.suffix;
                                      }
                                          });
                                            },

                                              onUnload() {
                                                  if (unpatch) unpatch();
                                                    },

                                                      settings() {
                                                          return (
                                                                <RN.ScrollView style={{ flex: 1, padding: 12 }}>
                                                                        <Forms.FormSection title="Message Suffix">
                                                                                  <Forms.FormText>
                                                                                              This text is appended to every message you send.
                                                                                                        </Forms.FormText>

                                                                                                                  <Forms.FormInput
                                                                                                                              value={storage.suffix}
                                                                                                                                          onChange={(v) => (storage.suffix = v)}
                                                                                                                                                      placeholder="Enter suffix text"
                                                                                                                                                                  multiline
                                                                                                                                                                            />
                                                                                                                                                                                    </Forms.FormSection>
                                                                                                                                                                                          </RN.ScrollView>
                                                                                                                                                                                              );
                                                                                                                                                                                                }
                                                                                                                                                                                                };