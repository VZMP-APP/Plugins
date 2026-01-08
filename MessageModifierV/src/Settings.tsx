import { ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

const { FormIcon, FormSwitchRow, FormInput, FormDivider, FormRow } = Forms;
const { Text, View } = ReactNative;

export default () => {
  useProxy(storage);

  return (
    <ReactNative.ScrollView style={{ padding: 10 }}>
      <FormSwitchRow
        label="Enable Message Appender"
        subLabel="Toggle to enable/disable appending text to messages"
        leading={<FormIcon source={getAssetIDByName("ic_message_edit")} />}
        onValueChange={(v) => void (storage.enabled = v)}
        value={storage.enabled}
      />
      
      <FormDivider />
      
      <FormRow
        label="Space Padding"
        subLabel={`Number of spaces to add before custom text (current: ${storage.spacePadding || 0})`}
        leading={<FormIcon source={getAssetIDByName("ic_text")} />}
      />
      <FormInput
        placeholder="Enter number of spaces (e.g., 69)"
        value={String(storage.spacePadding || 0)}
        onChange={(v) => {
          const num = parseInt(v);
          storage.spacePadding = isNaN(num) ? 0 : Math.max(0, num);
        }}
        keyboardType="numeric"
      />
      
      <FormDivider />
      
      <FormRow
        label="Custom Text"
        subLabel="Text to append to every message"
        leading={<FormIcon source={getAssetIDByName("ic_compose")} />}
      />
      <FormInput
        placeholder="Enter custom text..."
        value={storage.customText || ""}
        onChange={(v) => void (storage.customText = v)}
        multiline={true}
        numberOfLines={6}
        style={{ minHeight: 150 }}
      />
      
      <FormDivider />
      
      <View style={{ padding: 10, backgroundColor: "#2b2d31", borderRadius: 8, marginTop: 10 }}>
        <Text style={{ color: "#b5bac1", fontSize: 12, marginBottom: 5 }}>
          Preview:
        </Text>
        <Text style={{ color: "#dbdee1", fontSize: 11 }}>
          Your message{" ".repeat(Math.min(storage.spacePadding || 0, 20))}...
        </Text>
        <Text style={{ color: "#949ba4", fontSize: 10, marginTop: 5 }}>
          {storage.customText || "(No custom text set)"}
        </Text>
      </View>
      
      <FormDivider />
      
      <View style={{ padding: 10, marginTop: 10 }}>
        <Text style={{ color: "#949ba4", fontSize: 11 }}>
          Note: Messages will have spaces and your custom text appended automatically when sent.
        </Text>
      </View>
    </ReactNative.ScrollView>
  );
};

