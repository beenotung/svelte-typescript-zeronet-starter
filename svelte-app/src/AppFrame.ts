import { ZeroFrame, SiteInfo } from './ZeroFrame';
import { get, writable } from 'svelte/store';

export interface Message {
  cert_user_id?: string;
  content: string;
  created_at: number;
}
interface Data {
  message: Message[];
}
export class AppFrame extends ZeroFrame {
  siteInfo = writable<SiteInfo | {}>({});
  messages = writable<Message[]>([]);
  connected = writable(false);
  async onOpenWebsocket() {
    this.log('onOpenWebsocket');
    this.connected.set(true);
    // for mobile web
    this.cmdp('wrapperSetViewport', ['width=device-width, initial-scale=1.0']);
    let siteInfo = await this.cmdp('siteInfo');
    // this.log('setSiteInfo', siteInfo);
    this.siteInfo.set(siteInfo);
    this.loadMessages();
  }
  onCloseWebsocket() {
    this.log('onCloseWebsocket');
    this.connected.set(false);
  }
  onRequest(cmd, message) {
    if (cmd == 'setSiteInfo') {
      this.siteInfo.set(message.params);
      if (message.params.event[0] == 'file_done') {
        this.loadMessages();
      }
      return;
    }
    this.log('onRequest', { cmd, message });
  }
  selectUser() {
    this.cmdp('certSelect', { accepted_domains: ['zeroid.bit'] });
  }
  async sendMessage(content: string, done: (content: string) => void) {
    let siteInfo = get(this.siteInfo);
    if (!siteInfo.cert_user_id) {
      this.notice('info', 'Please select your account then try again');
      this.selectUser();
      return;
    }
    if (!content) {
      this.notice('info', 'Please input message, then try again');
      return;
    }
    let dir = 'data/users/' + siteInfo.auth_address;
    let data_path = dir + '/data.json';
    let content_path = dir + '/content.json';
    let data: Data = await this.cmdp('fileGet', {
      inner_path: data_path,
      required: false,
    });
    if (data) {
      data = JSON.parse(data as any);
    } else {
      data = { message: [] };
    }
    data.message.push({ content, created_at: Date.now() });
    let raw = unescape(
      encodeURIComponent(JSON.stringify(data, undefined, '\t')),
    );
    let res = await this.cmdp('fileWrite', [data_path, btoa(raw)]);
    if (res !== 'ok') {
      this.notice('error', 'Failed to save message: #{res}');
      return;
    }
    done(content);
    this.loadMessages();
    await this.cmdp('siteSign', { inner_path: content_path });
    await this.cmdp('sitePublish', { inner_path: content_path, sign: false });
  }
  notice(...args: string[]) {
    this.cmdp('wrapperNotification', args);
  }
  async loadMessages() {
    this.log('load messages');
    let messages: Message[] = await this.cmdp('dbQuery', [
      'select cert_user_id,content,created_at from message inner join json using(json_id) order by created_at desc',
    ]);
    this.log('loaded messages');
    this.messages.set(messages);
  }
}
