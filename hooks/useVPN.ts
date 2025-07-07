import { useState, useEffect } from 'react';
import { vpnService } from '@/lib/vpn';
import { VPNStatus } from '@/types';

export function useVPN() {
  const [status, setStatus] = useState<VPNStatus>(vpnService.getStatus());
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleStatusChange = (newStatus: VPNStatus) => {
      setStatus(newStatus);
      setConnecting(false);
    };

    vpnService.addStatusListener(handleStatusChange);
    return () => vpnService.removeStatusListener(handleStatusChange);
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const success = await vpnService.connect('wireguard-config');
      if (!success) {
        setConnecting(false);
      }
    } catch (error) {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    setConnecting(true);
    try {
      await vpnService.disconnect();
    } catch (error) {
      setConnecting(false);
    }
  };

  return {
    status,
    connecting,
    connect,
    disconnect,
  };
}