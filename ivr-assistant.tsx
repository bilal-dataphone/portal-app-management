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
    await createAssistant({
      name: assistantName,
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

  async function handleToggle(id: string, enabled: boolean) {
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
                    {record.enabled ? "Active" : "Disabled"}
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
                      title="Delete assistant?"
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
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreateAssistant}
        okText="Create"
      >
        <Space
          direction="vertical"
          style={{ width: "100%" }}
        >
          <Input
            placeholder="Assistant name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
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