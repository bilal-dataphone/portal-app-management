// src/features/voices/VoiceSettings.tsx

import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Select,
  Switch,
  Slider,
  Input,
  Typography,
  Space,
  Divider,
  Alert,
} from "antd";

import { getVoices, saveVoiceSettings } from "@/services/voice.service";

const { Title, Text } = Typography;

export default function VoiceSettings() {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [stability, setStability] = useState(0.7);
  const [similarity, setSimilarity] = useState(0.85);
  const [voiceBoost, setVoiceBoost] = useState(true);
  const [greeting, setGreeting] = useState(
    "Thank you for calling. How may I help you today?"
  );

  useEffect(() => {
    async function loadVoices() {
      const data = await getVoices();

      setVoices(data);

      if (data.length > 0) {
        setSelectedVoice(data[0].id);
      }
    }

    loadVoices();
  }, []);

  const handleSave = async () => {
    await saveVoiceSettings({
      voiceId: selectedVoice,
      playbackSpeed,
      stability,
      similarity,
      voiceBoost,
      greeting,
    });
  };

  return (
    <Card style={{ maxWidth: 850 }}>
      <Title level={3}>Voice Settings</Title>

      <Text type="secondary">
        Configure the default AI voice used for IVR assistants.
      </Text>

      <Divider />

      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Text strong>Voice</Text>

          <Select
            style={{ width: "100%", marginTop: 8 }}
            placeholder="Select a voice"
            value={selectedVoice}
            options={voices.map((voice) => ({
              label: voice.name,
              value: voice.id,
            }))}
            onChange={setSelectedVoice}
          />
        </div>

        <div>
          <Text strong>Greeting Message</Text>

          <Input.TextArea
            rows={4}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
        </div>

        <div>
          <Text strong>Playback Speed</Text>

          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={playbackSpeed}
            onChange={setPlaybackSpeed}
          />
        </div>

        <div>
          <Text strong>Voice Stability</Text>

          <Slider
            min={0}
            max={1}
            step={0.05}
            value={stability}
            onChange={setStability}
          />
        </div>

        <div>
          <Text strong>Similarity Boost</Text>

          <Slider
            min={0}
            max={1}
            step={0.05}
            value={similarity}
            onChange={setSimilarity}
          />
        </div>

        <div>
          <Space>
            <Switch
              checked={voiceBoost}
              onChange={setVoiceBoost}
            />

            <Text>Enable voice enhancement</Text>
          </Space>
        </div>

        <Alert
          type="info"
          showIcon
          message="Changes will apply to newly created IVR assistants."
        />

        <Button
          type="primary"
          size="large"
          onClick={handleSave}
        >
          Save Voice Settings
        </Button>
      </Space>
    </Card>
  );
}