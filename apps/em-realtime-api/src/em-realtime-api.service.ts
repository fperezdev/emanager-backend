import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { MessageResponse } from './lib/types';

const PROJECT_ID = process.env.GCP_PROJECT_ID;

@Injectable()
export class EmRealtimeApiService {
  private bigquery = new BigQuery({ projectId: PROJECT_ID });

  async getMessages(email: string): Promise<ReadonlyArray<MessageResponse>> {
    const query = `
      SELECT 
        mt.id, mt.threadId, mt.date, mt.from, mt.categories,
        SUBSTR(mt.subject, 1, 20) as subject,
        SUBSTR(mt.content, 1, 20) as content
      FROM \`emanager_messages_dataset.message\` mt
      WHERE mt.to = '${email}'
      ORDER BY date DESC
      LIMIT 15
    `;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'us-central1',
    };

    // Run the query as a job
    const [job] = await this.bigquery.createQueryJob(options);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // Map the results
    return rows.map((row) => ({
      id: row.id,
      threadId: row.threadId,
      date: row.date.value,
      subject: row.subject,
      from: row.from,
      content: row.content,
      categories: row.categories,
    }));
  }
}
