import { VPNStatus } from '@/types';

class VPNService {
  private status: VPNStatus = {
    connected: false,
    data_used_session: 0,
  };

  private listeners: ((status: VPNStatus) => void)[] = [];

  connect = async (serverConfig: string): Promise<boolean> => {
    try {
      // In a real implementation, this would interface with WireGuard
      // For now, we'll simulate the connection
      this.status = {
        connected: true,
        server_ip: '103.126.213.45',
        server_location: 'Lagos, Nigeria',
        connection_time: Date.now(),
        data_used_session: 0,
        upload_speed: 0,
        download_speed: 0,
      };
      
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('VPN connection failed:', error);
      return false;
    }
  };

  disconnect = async (): Promise<boolean> => {
    try {
      this.status = {
        connected: false,
        data_used_session: 0,
      };
      
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('VPN disconnection failed:', error);
      return false;
    }
  };

  getStatus = (): VPNStatus => {
    return this.status;
  };

  addStatusListener = (listener: (status: VPNStatus) => void) => {
    this.listeners.push(listener);
  };

  removeStatusListener = (listener: (status: VPNStatus) => void) => {
    this.listeners = this.listeners.filter(l => l !== listener);
  };

  private notifyListeners = () => {
    this.listeners.forEach(listener => listener(this.status));
  };

  // Simulate data usage tracking
  updateDataUsage = (megabytes: number) => {
    if (this.status.connected) {
      this.status.data_used_session = (this.status.data_used_session || 0) + megabytes;
      this.notifyListeners();
    }
  };
}

export const vpnService = new VPNService();