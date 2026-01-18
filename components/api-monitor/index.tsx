"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * ⚡ API Monitor - Componente para monitorear llamadas API en desarrollo
 * Muestra estadísticas en tiempo real sobre las llamadas API
 */
const ApiMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    postsCalls: 0,
    currentUserCalls: 0,
    usersCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
  });

  // Interceptar console logs para contar cache hits/misses
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalLog = console.log;

    console.log = function (...args) {
      const message = args.join(" ");

      // Contar cache hits y misses
      if (message.includes("✅ Cache HIT")) {
        setStats((prev) => ({
          ...prev,
          cacheHits: prev.cacheHits + 1,
          totalRequests: prev.totalRequests + 1,
        }));
      } else if (message.includes("❌ Cache MISS")) {
        setStats((prev) => ({
          ...prev,
          cacheMisses: prev.cacheMisses + 1,
          totalRequests: prev.totalRequests + 1,
        }));
      }

      // Contar llamadas específicas a endpoints
      if (message.includes("GET /api/posts")) {
        setStats((prev) => ({ ...prev, postsCalls: prev.postsCalls + 1 }));
      } else if (message.includes("GET /api/current-user")) {
        setStats((prev) => ({
          ...prev,
          currentUserCalls: prev.currentUserCalls + 1,
        }));
      } else if (message.includes("GET /api/users")) {
        setStats((prev) => ({ ...prev, usersCalls: prev.usersCalls + 1 }));
      }

      originalLog.apply(console, args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 border border-border bg-background"
        onClick={() => setIsVisible(!isVisible)}>
        📊 API Stats
      </Button>

      {isVisible && (
        <Card className="fixed bottom-16 right-4 z-50 w-80 border-border bg-background shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Posts API:</span>
              <span className="font-mono">{stats.postsCalls}</span>
            </div>
            <div className="flex justify-between">
              <span>Current User:</span>
              <span className="font-mono">{stats.currentUserCalls}</span>
            </div>
            <div className="flex justify-between">
              <span>Users API:</span>
              <span className="font-mono">{stats.usersCalls}</span>
            </div>
            <div className="mt-2 border-t pt-2">
              <div className="flex justify-between">
                <span>Cache Hits:</span>
                <span className="font-mono text-green-600">{stats.cacheHits}</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Misses:</span>
                <span className="font-mono text-red-600">{stats.cacheMisses}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Hit Rate:</span>
                <span className="font-mono">
                  {stats.totalRequests > 0
                    ? `${Math.round((stats.cacheHits / stats.totalRequests) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full"
              onClick={() =>
                setStats({
                  postsCalls: 0,
                  currentUserCalls: 0,
                  usersCalls: 0,
                  cacheHits: 0,
                  cacheMisses: 0,
                  totalRequests: 0,
                })
              }>
              Reset Counters
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ApiMonitor;
