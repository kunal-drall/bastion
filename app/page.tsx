"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { Loader2, ArrowUpRight, ArrowDownRight, Shield, FileCheck, AlertTriangle } from 'lucide-react';

interface TokenPrice {
  usd: number;
  usd_24h_change?: number;
}

interface MarketData {
  bitcoin: TokenPrice;
  ethereum: TokenPrice;
  solana: TokenPrice;
  dogecoin: TokenPrice;
  'shiba-inu': TokenPrice;
  pepe: TokenPrice;
}

interface ChartData {
  name: string;
  value: number;
}

interface Position {
  id: string;
  asset: string;
  amount: number;
  value: number;
  coverage: number;
}

interface Policy {
  id: string;
  asset: string;
  coverage: number;
  premium: number;
  expiry: string;
  status: 'active' | 'expired';
}

const mockPositions: Position[] = [
  { id: '1', asset: 'BTC', amount: 0.5, value: 21000, coverage: 15000 },
  { id: '2', asset: 'ETH', amount: 4.2, value: 8400, coverage: 7000 },
];

const mockPolicies: Policy[] = [
  { 
    id: '1', 
    asset: 'BTC', 
    coverage: 15000, 
    premium: 150, 
    expiry: '2024-12-31', 
    status: 'active' 
  },
  { 
    id: '2', 
    asset: 'ETH', 
    coverage: 7000, 
    premium: 70, 
    expiry: '2024-12-31', 
    status: 'active' 
  },
];

export default function Home() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true);
      try {
        const [priceResponse, historyResponse] = await Promise.all([
          api.getMarketData(),
          api.getHistoricalData(7)
        ]);

        if (priceResponse.data) {
          setMarketData(priceResponse.data as MarketData);
        }

        if (historyResponse.data?.prices) {
          const formattedData = historyResponse.data.prices.map(([timestamp, price]: [number, number]) => ({
            name: new Date(timestamp).toLocaleDateString(),
            value: Math.round(price)
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const renderPriceChange = (change?: number) => {
    if (!change) return null;
    const isPositive = change > 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const renderTokenCard = (name: string, data?: TokenPrice) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>
          <span className="text-2xl font-bold">${data?.usd.toLocaleString()}</span>
          <div className="text-sm font-normal mt-1">
            {renderPriceChange(data?.usd_24h_change)}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bastion Protocol Dashboard</CardTitle>
              <CardDescription>Monitor your insurance positions and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-5 gap-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="request">Request Insurance</TabsTrigger>
                  <TabsTrigger value="claim">Claim Insurance</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {renderTokenCard('Bitcoin', marketData?.bitcoin)}
                        {renderTokenCard('Ethereum', marketData?.ethereum)}
                        {renderTokenCard('Solana', marketData?.solana)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {renderTokenCard('Dogecoin', marketData?.dogecoin)}
                        {renderTokenCard('Shiba Inu', marketData?.['shiba-inu'])}
                        {renderTokenCard('PEPE', marketData?.pepe)}
                      </div>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="positions">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Active Positions</h3>
                      <Button>
                        <Shield className="mr-2 h-4 w-4" />
                        Insure Position
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {mockPositions.map((position) => (
                        <Card key={position.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{position.asset} Position</h4>
                                <span className="text-sm text-muted-foreground">
                                  Amount: {position.amount} {position.asset}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">${position.value.toLocaleString()}</span>
                                <div className="text-sm text-muted-foreground">
                                  Coverage: ${position.coverage.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="policies">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Insurance Policies</h3>
                      <Button>
                        <Shield className="mr-2 h-4 w-4" />
                        New Policy
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {mockPolicies.map((policy) => (
                        <Card key={policy.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{policy.asset} Insurance</h4>
                                <span className="text-sm text-muted-foreground">
                                  Expires: {policy.expiry}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">
                                  Coverage: ${policy.coverage.toLocaleString()}
                                </span>
                                <div className="text-sm text-muted-foreground">
                                  Premium: ${policy.premium}/month
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="request">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Request Insurance Coverage</h3>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Asset</label>
                              <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
                                <option>Bitcoin (BTC)</option>
                                <option>Ethereum (ETH)</option>
                                <option>Solana (SOL)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Coverage Amount</label>
                              <input 
                                type="number" 
                                placeholder="Enter amount in USD"
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Coverage Period</label>
                            <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
                              <option>1 Month</option>
                              <option>3 Months</option>
                              <option>6 Months</option>
                              <option>12 Months</option>
                            </select>
                          </div>
                          <Button className="w-full">Calculate Premium</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="claim">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <FileCheck className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Submit Insurance Claim</h3>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Select Policy</label>
                            <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
                              <option>BTC Policy #1 - Coverage: $15,000</option>
                              <option>ETH Policy #2 - Coverage: $7,000</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Claim Amount</label>
                            <input 
                              type="number" 
                              placeholder="Enter claim amount in USD"
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Reason for Claim</label>
                            <textarea 
                              rows={4}
                              placeholder="Describe the reason for your claim"
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                            />
                          </div>
                          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 mt-0.5" />
                            <span>Please ensure all information is accurate. False claims may result in policy termination.</span>
                          </div>
                          <Button className="w-full">Submit Claim</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}