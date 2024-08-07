import { SSTConfig } from "sst";
import { NextjsSite, Bucket, Function, Table, Cron, Api} from "sst/constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda'; 

import path from 'path'

export default {
  config(_input) {
    return {
      name: "frontend",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // const bucket = new Bucket(stack, 'DataBucket');

      // // const layer = new lambda.LayerVersion(stack, 'MyLayer', {
      // //   code: lambda.Code.fromAsset('..')
      // // })

      // const table = new Table(stack, 'DataTable', {
      //   fields: {
      //     id: 'string',
      //   },
      //   primaryIndex: { partitionKey: 'id'}
      // });

      // const scraper = new Function(stack, 'ScraperFunction', {
      //   handler: path.join('..', 'backend', 'python', 'scraper.handler'),
      //   runtime: 'python3.8',
      //   // layers: [layer],
      //   environment: {
      //     BUCKET_NAME: bucket.bucketName,
      //     MAIN_URL: 'https://hf-foodpro.austin.utexas.edu/foodpro/location.aspx',
      //     DINING_URL: 'https://hf-foodpro.austin.utexas.edu/foodpro/',
      //   }
      // })

      // new Cron(stack, 'ScraperCron', {
      //   schedule: 'cron(1 0 * * ? *)',
      //   job: scraper,
      // })

      // const transferFunction = new Function(stack, 'TransferFunction', {
      //   handler: path.join('..', 'backend', 'python', 'transfer.handler'),
      //   runtime: 'python3.8',
      //   environment: {
      //     BUCKET_NAME: bucket.bucketName,
      //     TABLE_NAME: table.tableName,
      //   }
      // })

      // bucket.addNotifications(stack, {
      //   myNotification: {
      //     function: transferFunction,
      //     events: ['object_created'],
      //   }
      // })
      
      // const api = new Api(stack, 'Api', {
      //   routes: {
      //     'GET /data': {
      //       function: {
      //         handler: path.join('..', 'backend', 'python', 'api.handler'),
      //         runtime: "python3.8",
      //       }
      //     },
      //   }
      // })

      const site = new NextjsSite(stack, "site", {
        // environment: {
        //   API_URL: api.url
        // }
        
      });

      stack.addOutputs({
        SiteUrl: site.url,
        // BucketName: bucket.bucketName,
        // TableName: table.tableName, 
        // ApiUrl: api.url,
      });
    });
  },
} satisfies SSTConfig;
