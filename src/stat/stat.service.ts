import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class StatService {
  public async insert(payload: { project_id: string; query_type: string }) {
    try {
      const opts = {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc2ZmQwMjc4NjA2ZjEzMzhhZGE4NTkiLCJzZXJ2aWNlX25hbWUiOiJjb3JlIiwicGFzc3dvcmQiOiJjb3JlIiwiX192IjowLCJpYXQiOjE3MDI0NDI5MDZ9.b5tdQRiKxfzn7GmGSs5Wxniuvj1dpCfT1WfxP19KGzo',
        },
      };

      const response = await axios.post(
        'http://localhost:5000/swiftbase/db/stats/',
        payload,
        opts,
      );
      console.log('================= insert state serivce =================');
      console.log(payload);
      console.log(response.status);
      console.log(response.data);
    } catch (error) {
      console.log('======= in stat insert method =====');
      console.log(error);
    }
  }
}
