import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { trace } from '@opentelemetry/api';

export const getTracer = (name: string) => trace.getTracer(name);

export const initTelemetry = () => {
  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  const sdk = new NodeSDK({
    traceExporter: exporter,
    serviceName: process.env.SERVICE_NAME || 'chat-backend-service',
    instrumentations: [], 
  });

  try {
    sdk.start();
    console.log('OpenTelemetry Started...');
  } catch (e) {
    console.error('Telemetry Error:', e);
  }
};