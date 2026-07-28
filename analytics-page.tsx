// src/features/analytics/AnalyticsDashboard.tsx

import { useEffect, useState } from "react";
import {
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Typography,
} from "antd";

import { getAnalytics } from "@/services/analytics.service";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>({
    totalCalls: 0,
    answeredCalls: 0,
    missedCalls: 0,
    averageDuration: "0m",
    topAssistants: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    const response = await getAnalytics();

    setAnalytics(response);

    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Analytics Dashboard</Title>

      <Text type="secondary">
        Monitor call activity, assistant performance and customer interactions.
      </Text>

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <RangePicker />

        <Select
          style={{ width: 180, marginLeft: 12 }}
          defaultValue="all"
          options={[
            { label: "All Assistants", value: "all" },
            { label: "Sales", value: "sales" },
            { label: "Support", value: "support" },
          ]}
        />
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Calls"
              value={analytics.totalCalls}
              loading={loading}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Answered Calls"
              value={analytics.answeredCalls}
              loading={loading}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Missed Calls"
              value={analytics.missedCalls}
              loading={loading}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Average Duration"
              value={analytics.averageDuration}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Answer Rate"
        style={{ marginTop: 24 }}
      >
        <Progress percent={94} />
      </Card>

      <Card
        title="Top Performing Assistants"
        style={{ marginTop: 24 }}
      >
        <Table
          loading={loading}
          rowKey="id"
          pagination={false}
          dataSource={analytics.topAssistants}
          columns={[
            {
              title: "Assistant",
              dataIndex: "name",
            },
            {
              title: "Calls",
              dataIndex: "calls",
            },
            {
              title: "Resolution Rate",
              dataIndex: "resolutionRate",
            },
            {
              title: "Average Duration",
              dataIndex: "averageDuration",
            },
          ]}
        />
      </Card>
    </div>
  );
}