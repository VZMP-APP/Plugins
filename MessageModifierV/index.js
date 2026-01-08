const { storage } = vendetta;
const { before } = vendetta.patcher;
const { getByProps } = vendetta.metro;
const { showToast } = vendetta.ui.toasts;

// Default footer text
const defaultFooter = `(                                                                     )
-# This user is suspected of conducting spy activities for the Russian Federation • [Learn more](<https://support.discord.com/hc/en-us>)
-# This user is under the supervision of the BKA • [Review](<https://www.bka.de/DE/Home/home_node.html>)
-# This user needs to get tormented by a Dominant Female by her feet • [DM NOW](<https://discordapp.com/users/1016016621397090384>)`;

// Initialize settings
const settings = storage.createProxy({
    footerText: defaultFooter,
    enabled: true
});

let unpatch;

export default {
    onLoad: () => {
        try {
            const MessageQueue = getByProps("sendMessage");
            
            if (!MessageQueue) {
                showToast("Failed to find message module", "error");
                return;
            }

            unpatch = before("sendMessage", MessageQueue, (args) => {
                if (!settings.enabled) return;
                
                const [channelId, message] = args;
                
                if (message && message.content) {
                    const originalContent = message.content;
                    
                    // Only add footer if it's not already there
                    if (!originalContent.includes(settings.footerText)) {
                        message.content = originalContent + settings.footerText;
                    }
                }
            });

            showToast("Message Modifier loaded", "success");
        } catch (error) {
            showToast(`Error loading plugin: ${error.message}`, "error");
            console.error("Message Modifier error:", error);
        }
    },

    onUnload: () => {
        unpatch?.();
        showToast("Message Modifier unloaded", "info");
    },

    settings: {
        // Settings UI
        render: () => {
            const { FormSection, FormRow, FormInput, FormSwitch, FormDivider } = vendetta.ui.components;
            
            return (
                <>
                    <FormSection title="Message Modifier Settings">
                        <FormRow
                            label="Enable Plugin"
                            trailing={
                                <FormSwitch
                                    value={settings.enabled}
                                    onValueChange={(value) => {
                                        settings.enabled = value;
                                        showToast(
                                            value ? "Plugin enabled" : "Plugin disabled",
                                            value ? "success" : "info"
                                        );
                                    }}
                                />
                            }
                        />
                        
                        <FormDivider />
                        
                        <FormRow label="Footer Text">
                            <FormInput
                                value={settings.footerText}
                                onChange={(value) => {
                                    settings.footerText = value;
                                }}
                                placeholder="Enter footer text..."
                                multiline={true}
                                numberOfLines={10}
                                style={{
                                    minHeight: 150,
                                    fontFamily: "monospace"
                                }}
                            />
                        </FormRow>
                        
                        <FormRow
                            label="Reset to Default"
                            trailing={
                                <FormButton
                                    text="Reset"
                                    onPress={() => {
                                        settings.footerText = defaultFooter;
                                        showToast("Reset to default footer", "success");
                                    }}
                                />
                            }
                        />
                    </FormSection>
                </>
            );
        }
    }
};
