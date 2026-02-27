/* global state */
let sessionId = null;

const API = ''; // same-origin when served by FastAPI

/* ── Panel navigation ── */
const panels = {
  chat: document.getElementById('panel-chat'),
  agents: document.getElementById('panel-agents'),
  web3: document.getElementById('panel-web3'),
};
const navBtns = {
  chat: document.getElementById('btn-chat'),
  agents: document.getElementById('btn-agents'),
  web3: document.getElementById('btn-web3'),
};

function showPanel(name) {
  Object.entries(panels).forEach(([k, el]) => {
    el.hidden = k !== name;
  });
  Object.entries(navBtns).forEach(([k, btn]) => {
    btn.classList.toggle('active', k === name);
  });
  if (name === 'agents') loadAgents();
}

navBtns.chat.addEventListener('click', () => showPanel('chat'));
navBtns.agents.addEventListener('click', () => showPanel('agents'));
navBtns.web3.addEventListener('click', () => showPanel('web3'));

/* ── Chat ── */
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(role, content) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = role === 'user' ? 'You' : 'AI Agent';
  div.appendChild(label);
  const text = document.createTextNode(content);
  div.appendChild(text);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = '';
  appendMessage('user', message);

  try {
    const res = await fetch(`${API}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    sessionId = data.session_id;
    appendMessage('assistant', data.reply);
  } catch (err) {
    appendMessage('assistant', `⚠️ Error: ${err.message}`);
  }
});

/* seed a welcome message */
appendMessage('assistant', "👋 Hello! I'm the AI DevOps & Web3 Intelligence agent. Type 'help' to see what I can do.");

/* ── Agents ── */
const agentList = document.getElementById('agent-list');
const btnRefresh = document.getElementById('btn-refresh-agents');

async function loadAgents() {
  agentList.textContent = 'Loading…';
  try {
    const res = await fetch(`${API}/api/v1/agents`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const agents = await res.json();
    agentList.innerHTML = '';
    agents.forEach((a) => {
      const card = document.createElement('div');
      card.className = 'agent-card';
      card.innerHTML = `
        <span class="agent-name">🤖 ${escHtml(a.name)}</span>
        <span class="agent-meta">${a.rules_count} intent rules</span>
      `;
      agentList.appendChild(card);
    });
  } catch (err) {
    agentList.textContent = `Error: ${err.message}`;
  }
}

btnRefresh.addEventListener('click', loadAgents);

/* ── Web3 Wallet Connect ── */
const walletStatus = document.getElementById('wallet-status');
const btnConnect = document.getElementById('btn-connect-wallet');
const walletInfo = document.getElementById('wallet-info');

btnConnect.addEventListener('click', async () => {
  if (typeof window.ethereum === 'undefined') {
    walletStatus.textContent = '⚠️ No Web3 provider detected. Install MetaMask or a compatible wallet.';
    walletStatus.className = 'wallet-status disconnected';
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    walletStatus.textContent = `🟢 Connected`;
    walletStatus.className = 'wallet-status connected';
    walletInfo.hidden = false;
    walletInfo.innerHTML = `
      <strong>Address:</strong> ${escHtml(account)}<br>
      <strong>Chain ID:</strong> ${parseInt(chainId, 16)}
    `;
    btnConnect.textContent = '✓ Wallet Connected';
    btnConnect.disabled = true;
  } catch (err) {
    walletStatus.textContent = `🔴 Connection rejected: ${err.message}`;
  }
});

/* ── Utility ── */
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
