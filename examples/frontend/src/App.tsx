// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Button, Card, Container, Flex, Grid } from '@radix-ui/themes';
import { CreateAllowlist } from './CreateAllowlist';
import { Allowlist } from './Allowlist';
import WalrusUpload from './EncryptAndUpload';
import { CreateService } from './CreateSubscriptionService';
import FeedsToSubscribe from './SubscriptionView';
import { Service } from './SubscriptionService';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AllAllowlist } from './OwnedAllowlists';
import { AllServices } from './OwnedSubscriptionServices';
import Feeds from './AllowlistView';

function LandingPage() {
  return (
    <Grid columns="2" gap="6" style={{ marginTop: '2rem' }}>
      <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: '#f9f9f9' }}>
        <Flex direction="column" gap="3" align="center" style={{ height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#2c3e50', fontWeight: '600' }}>Allowlist Example</h2>
            <p style={{ color: '#7f8c8d' }}>
              Shows how a creator can define an allowlist-based access. The creator can add or remove users
              from the list and associate encrypted files. Only those on the allowlist can decrypt the files.
            </p>
          </div>
          <Link to="/allowlist-example">
            <Button size="4" style={{ backgroundColor: '#3498db', color: '#fff', borderRadius: '8px' }}>
              Try it
            </Button>
          </Link>
        </Flex>
      </Card>
      <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: '#f9f9f9' }}>
        <Flex direction="column" gap="3" align="center" style={{ height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#2c3e50', fontWeight: '600' }}>Subscription Example</h2>
            <p style={{ color: '#7f8c8d' }}>
              Shows how a creator can define a subscription-based access to files. The creator sets the fee
              and duration, and users with valid subscriptions can access the encrypted files.
            </p>
          </div>
          <Link to="/subscription-example">
            <Button size="4" style={{ backgroundColor: '#e74c3c', color: '#fff', borderRadius: '8px' }}>
              Try it
            </Button>
          </Link>
        </Flex>
      </Card>
    </Grid>
  );
}

function App() {
  const currentAccount = useCurrentAccount();
  const [recipientAllowlist, setRecipientAllowlist] = useState<string>('');
  const [capId, setCapId] = useState<string>('');

  return (
    <Container style={{ backgroundColor: '#ecf0f1', minHeight: '100vh', padding: '2rem' }}>
      <Flex position="sticky" px="4" py="2" justify="between" style={{ backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 className="text-4xl font-bold m-4 mb-8" style={{ color: '#2c3e50' }}>Seal Example Apps</h1>
        <Box>
          <ConnectButton style={{ borderRadius: '8px', padding: '8px 16px', backgroundColor: '#2ecc71', color: '#fff' }} />
        </Box>
      </Flex>
      <Card style={{ marginBottom: '2rem', backgroundColor: '#fff', padding: '1.5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
          1. Code is available{' '}
          <a href="https://github.com/MystenLabs/seal/tree/main/examples" style={{ color: '#3498db' }}>here</a>.
        </p>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
          2. These examples are for Testnet only. Make sure your wallet is set to Testnet and has some balance 
          (can request from <a href="https://faucet.sui.io/" style={{ color: '#3498db' }}>faucet.sui.io</a>).
        </p>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
          3. Blobs are only stored on Walrus Testnet for 1 epoch by default, older files cannot be retrieved even if you have access.
        </p>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
          4. Only image files are supported, and the UI is minimal, designed for demo purposes only.
        </p>
      </Card>
      {currentAccount ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/allowlist-example/*"
              element={
                <Routes>
                  <Route path="/" element={<CreateAllowlist />} />
                  <Route
                    path="/admin/allowlist/:id"
                    element={
                      <div>
                        <Allowlist setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                        <WalrusUpload policyObject={recipientAllowlist} cap_id={capId} moduleName="allowlist" />
                      </div>
                    }
                  />
                  <Route path="/admin/allowlists" element={<AllAllowlist />} />
                  <Route path="/view/allowlist/:id" element={<Feeds suiAddress={currentAccount.address} />} />
                </Routes>
              }
            />
            <Route
              path="/subscription-example/*"
              element={
                <Routes>
                  <Route path="/" element={<CreateService />} />
                  <Route
                    path="/admin/service/:id"
                    element={
                      <div>
                        <Service setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                        <WalrusUpload policyObject={recipientAllowlist} cap_id={capId} moduleName="subscription" />
                      </div>
                    }
                  />
                  <Route path="/admin/services" element={<AllServices />} />
                  <Route path="/view/service/:id" element={<FeedsToSubscribe suiAddress={currentAccount.address} />} />
                </Routes>
              }
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <p>Please connect your wallet to continue</p>
      )}
    </Container>
  );
}

export default App;
