// src/features/ivr-assistant/IVRAssistantPage.tsx

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Popconfirm,
  Switch,
  message,
} from "antd";

import {
  getAssistants,
  createAssistant,
  deleteAssistant,
  toggleAssistant,
} from "@/services/ivr-assistant.service";

const { Title, Text } = Typography;

export default function IVRAssistantPage() {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assistantName, setAssistantName] = useState("");

  useEffect(() => {
    loadAssistants();
  }, []);

  async function loadAssistants() {
    setLoading(true);

    const data = await getAssistants();

    setAssistants(data);

    setLoading(false);
  }

  async function handleCreateAssistant() {
    const name = assistantName.trim();

    if (!name) {
      message.error("Assistant name is required");
      return;
    }

    await createAssistant({
      name,
      voice: "Rachel",
      language: "en",
      model: "gpt-4o",
    });

    setAssistantName("");
    setCreateModalOpen(false);

    loadAssistants();
  }

  async function handleDelete(id: string) {
    await deleteAssistant(id);

    loadAssistants();
  }

  // Only one assistant may answer inbound calls at a time. Enabling a second
  // active assistant previously left both enabled, which could double-route
  // or drop live customer calls.
  async function handleToggle(id: string, enabled: boolean) {
    if (enabled) {
      const otherActive = assistants.filter(
        (assistant) => assistant.enabled && assistant.id !== id
      );

      for (const assistant of otherActive) {
        await toggleAssistant(assistant.id, false);
      }
    }

    await toggleAssistant(id, enabled);

    loadAssistants();
  }

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2}>IVR Assistants</Title>

          <Text type="secondary">
            Create and manage AI assistants that answer incoming customer calls.
            Only one assistant can be active at a time.
          </Text>
        </div>

        <Button
          type="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          New Assistant
        </Button>
      </Space>

      <Card>
        {assistants.length === 0 ? (
          <Empty
            description="No IVR assistants have been created yet."
          />
        ) : (
          <Table
            loading={loading}
            rowKey="id"
            dataSource={assistants}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Voice",
                dataIndex: "voice",
              },
              {
                title: "Language",
                dataIndex: "language",
              },
              {
                title: "Calls",
                dataIndex: "callsHandled",
              },
              {
                title: "Status",
                render: (_, record) => (
                  <Tag color={record.enabled ? "green" : "default"}>
                    {record.enabled ? "Active — answering calls" : "Disabled"}
                  </Tag>
                ),
              },
              {
                title: "Enabled",
                render: (_, record) => (
                  <Switch
                    checked={record.enabled}
                    onChange={(checked) =>
                      handleToggle(record.id, checked)
                    }
                  />
                ),
              },
              {
                title: "Actions",
                render: (_, record) => (
                  <Space>
                    <Button>Edit</Button>

                    <Popconfirm
                      title={
                        record.enabled
                          ? "This assistant is answering live calls. Delete it anyway?"
                          : "Delete assistant?"
                      }
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Modal
        title="Create IVR Assistant"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setAssistantName("");
        }}
        onOk={handleCreateAssistant}
        okText="Create"
        okButtonProps={{ disabled: !assistantName.trim() }}
      >
        <Space
          direction="vertical"
          style={{ width: "100%" }}
        >
          <Input
            placeholder="Assistant name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            onPressEnter={handleCreateAssistant}
          />

          <Text type="secondary">
            You can configure prompts, voices, tools, and routing after the
            assistant has been created.
          </Text>
        </Space>
      </Modal>
    </div>
  );
}
