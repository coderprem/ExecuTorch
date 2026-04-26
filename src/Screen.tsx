import React from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLLM, Message, QWEN2_5_0_5B_QUANTIZED} from 'react-native-executorch';



const Screen = () => {
  const llm = useLLM({ model: QWEN2_5_0_5B_QUANTIZED });

  const handleGenerate = () => {
    // 2. Send a message to start generation
    llm.sendMessage('Which model should I use to segregate text using ExecuTorch');
  };



  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 50 }}>
        <Text>Status: {llm.isReady ? 'Ready' : 'Loading...'}</Text>
      
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={!llm.isReady || llm.isGenerating}
          style={styles.buttonContainer}
        >
          <Text style={styles.text}> Ask AI</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20 }}>
          {llm.response}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: '#5295ED',
    padding: 12,
    borderRadius: 12
  },
  text: {
    fontSize: 20,
  }
})

export default Screen;