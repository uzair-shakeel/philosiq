import React, { useState } from "react";
import Layout from "../components/Layout";

export default function DebugPage() {
  const [apiPath, setApiPath] = useState("/api/debug/request-info");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      if (method !== "GET" && method !== "HEAD") {
        try {
          options.body = body.trim() ? JSON.parse(body) : undefined;
        } catch (e) {
          throw new Error(`Invalid JSON body: ${e.message}`);
        }
      }

      const fullUrl = new URL(apiPath, window.location.origin).href;

      console.log(`Making ${method} request to ${fullUrl}`);
      const start = performance.now();

      const res = await fetch(fullUrl, options);
      const responseTime = performance.now() - start;

      // Get response as text first
      const responseText = await res.text();

      // Try to parse as JSON
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        responseData = { text: responseText };
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries([...res.headers.entries()]),
        data: responseData,
        time: responseTime.toFixed(2),
      });
    } catch (e) {
      console.error("API test error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="API Debug - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">API Debug Tool</h1>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <label className="block text-gray-700 mb-2" htmlFor="apiPath">
                    API Path
                  </label>
                  <input
                    id="apiPath"
                    type="text"
                    value={apiPath}
                    onChange={(e) => setApiPath(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="/api/..."
                  />
                </div>

                <div className="w-32">
                  <label className="block text-gray-700 mb-2" htmlFor="method">
                    Method
                  </label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="OPTIONS">OPTIONS</option>
                  </select>
                </div>
              </div>

              {method !== "GET" && method !== "HEAD" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="body">
                    Request Body (JSON)
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border rounded px-3 py-2 h-32 font-mono text-sm"
                    placeholder="{}"
                  />
                </div>
              )}

              <button
                onClick={testApi}
                disabled={loading}
                className={`py-2 px-4 text-white rounded ${
                  loading
                    ? "bg-primary-maroon/70 cursor-not-allowed"
                    : "bg-primary-maroon hover:bg-primary-darkMaroon"
                } transition-colors`}
              >
                {loading ? "Testing..." : "Test API"}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {response && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Response</h2>
                  <span className="text-sm text-gray-500">
                    {response.time}ms
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        response.status >= 200 && response.status < 300
                          ? "bg-green-100 text-green-800"
                          : response.status >= 400
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {response.status}
                    </div>
                    <div className="text-sm">{response.statusText}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-1">Headers</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Body</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
