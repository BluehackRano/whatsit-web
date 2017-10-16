<template>

  <div id="all">

    <div class="add-big-query-dataset-container">
      <h1>Add BigQuery Dataset</h1>

      <h2>Dataset Name</h2>
      <input type="text" v-model="datasetName" placeholder="Please enter the dataset name."/>

      <h2>Insert BigQuery Table Name</h2>
      <input type="text" v-model="tableName" placeholder="Please enter the BigQuery table name." value="8seconds" disabled/>

      <div class="bottom-buttons-container">
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active trim-info-bottom-complete-button" @click="completeButtonClicked">Complete</button>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active trim-info-bottom-buttons" @click="cancelAddBiqQueryDataset">Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>


</template>

<script>
  export default {
    name: 'AddBigQueryDataset',
    data: function () {
      return {
        projectId: '',
        datasetName: '',
        tableName: '8seconds'
      }
    },
    created: function () {
      this.projectId = this.$route.params.projectId
    },
    methods: {
      completeButtonClicked: function () {
        if (!this.datasetName || this.datasetName.trim() === '') {
          this.$modal.open('알림', 'Dataset Name을 입력하세요.', '확인')
          return
        }
        if (!this.tableName || this.tableName.trim() === '') {
          this.$modal.open('알림', 'BigQuery Table Name을 입력하세요.', '확인')
          return
        }

        this.addDataset()
      },
      cancelAddBiqQueryDataset: function () {
        this.$router.replace({ path: '/project/' + this.projectId + '/createDataset' })
      },

      addDataset: function () {
        var options = {
          projectId: this.projectId,
          name: this.datasetName,
          desc: 'This BigQuery dataset is made by whatsit-web',
          type: 'bigquery',
        }

        options.data = []

        let dataString = '{' +
          '"dataset_name": "stylelens",' +
          '"table_name": "8seconds",' +
          '"service_account": {' +
            '"type": "service_account",' +
            '"project_id": "bluelens-11b9b",' +
            '"private_key_id": "d8117bd9e6b15f105a6d11d9ad4b03e2221c1a14",' +
            '"private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCaNrYxFuD0AZzt\\nGRbDCFHebIr7Pv4Gv3PRDox0+cWFZVCUMTCh/B4UV9VibYrzTdT8Wj9Dj00kR42w\\nh1z1ZE2dzgNygiKujawQOivowWmeY4EzM63XlcYiCnM7kERnyoY8WKSOXKiJeZKn\\nPBY6zvOSTbTglOZWBb5Szg2EkQmdLarceaYNCwPVmxBk5Eh7XPfXh0Cwz9XHO/tb\\nA4fQg4ttB69aGGIy/KVpsYSFVOpnlehzP7SCRjkESxi4S1cj88GW6ZFs5NwgMLrQ\\nV9hZNP6/btAGQzej7kLJFKByUw6VX4fcp9aOyI7AxNX3Gmb1BV3azoxuLBs60+4b\\n7m2ApGdZAgMBAAECgf8HiApgeSJy0tg/Uul78ZkOor4Zp4nJtWjpqsVIdNp1Irga\\nc3uEXdYBwnaxAENbf3sxz0O+Gx7NZvNZ3lG8HBMeH91mhakYxMviRnC4K9ZuHbwB\\npBEMrOT2Bsl8JtIKuAIKizvUIznwO11YWcI33tuej1dPBcBdw9bcCWsPYgtA0m1X\\nRzjlpik0dakk+MXiXCadBK48oTu1mJqnlNN20ZyRvikqUkSb7B22i5WyuGTtw1JV\\nk5el1eF8q6vhfVZfJOmrUAFTCjrVM25qw2LxPTIfUHbKGF7hMSnCW5Hd8fAiBnb2\\nOHQi5E8HhIW8lbU1xOfg8AuEk83RgkCi/72B40cCgYEAy2g4ibQP3hea8NQ8335w\\ngM9CVf4KvjE5jQVb9dHywqa/OUQjJfGAflL6tMM9cCKXw2WqZEalnlCpD9eIWB0f\\noXPQFv944IX+rZrzGrDEVfVNpUy51cSzs24aOl+ytRs07OQ3eqiAZ38eRNn1gRua\\nB2zRqStTl0ybxMb976gTUfcCgYEAwhZRCfGxLt6OtnlcChTk3nyQ2oW8tdlq75bt\\n9xJMTcA3csFZ9rPx8pvB4d6bVwW/iE2LtEsm77y9L/uz0GyUUD47XhiH+SDJM212\\nM9PEoM7sLt7DMDqrJbcrRPsl3RQrVOSkOKhQje0V/b1utFkA8oAB/vFtRAjiFQ0S\\ndwXTvS8CgYAunUzPqfc0833rkQf+Q/CuZFEUeeqmWYuR2NeRRzL2Dtal3gqcCHNk\\n/8k6ob+zsgnLmsHoxxPvaxbDbaZuYwY7rtnSW2utMKgDyw3JYRcth9Dqf+HaroBs\\nL2BNXl8LCBgh7c8VCgabMVOTfcu4ccXjy7lkpmw6sTDFcMEDKiZ7UwKBgC8wOdfP\\nGaMpnU0kSIpy9gpaAuX+ahlUmTlTWtwdaMvmlhSiifr/WS4BTKxb8SzBSwYaxIK7\\nWuYi32SRL/DW1WCFIO4JzNV3cTO9w2VqcX4fkTD8HDzXptDureiBn30W8EodpQfZ\\ndGxtXlFpA0d59E8BbHrNvCE0f7NakEi78/UlAoGAE5Carmi6Ay8ajajIm+wjPBlo\\nVxMtOwC1qXO88/0pgv1xtGLFSpfrQJBOg0CxkkkT0PYb0K2eVHMtDJa98wm6m2zD\\n4wYc/p7JGlIH6X+gEHrAOsPhfcZu5ymippwZ7MJzKZVg9NH6v4vOQUiBsDtALwxG\\newYinVWDysqPgguFyUs=\\n-----END PRIVATE KEY-----\\n",' +
            '"client_email": "bluelens-style@bluelens-11b9b.iam.gserviceaccount.com",' +
            '"client_id": "110705968444794053642",' +
            '"auth_uri": "https://accounts.google.com/o/oauth2/auth",' +
            '"token_uri": "https://accounts.google.com/o/oauth2/token",' +
            '"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",' +
            '"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bluelens-style%40bluelens-11b9b.iam.gserviceaccount.com"' +
            '}' +
          '}'
        console.log(JSON.parse(dataString))
        options.data.push(JSON.parse(dataString))

//        console.log('requestAddDataset =>\n' + JSON.stringify(options))
         this.requestAddDataset(options)
      },

      requestAddDataset: function (options) {
        // request API
        return this.$store.dispatch('ADD_DATASET', {
          options: options
        }).then(() => {
          console.log('done ADD_DATASET in AddVideoDataset.vue')
          this.$router.replace({ path: '/project/' + this.projectId + '/datasets' })
          bus.$emit('fetch_datasets')
        })
      }
    }
  }
</script>

<style scoped>
  .add-big-query-dataset-container {
    position: absolute;
    left: 50%;
    width: 700px;
    height: 1000px;
    margin-left: -350px;
    /*background-color: white;*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2)*/
  }

  .add-big-query-dataset-container > h1 {
    height: 60px;
    margin-top: 35px;
    margin-bottom: 35px;
    font-size: 30pt;
    text-align: center;
  }

  .add-big-query-dataset-container > h2 {
    height: 30px;
    margin-top: 100px;
    margin-bottom: 20px;
    font-size: 20pt;
  }

  .add-big-query-dataset-container > input[type=text] {
    width: 100%;
    height: 60px;
    font-size: 30pt;
    padding-left: 10px;
    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 1px solid black;
  }

  /* -webkit-input-placeholder webkit */
  .add-big-query-dataset-container > input[type=text]::-webkit-input-placeholder { font-size: 15pt; font-style:italic; }
  /* -webkit-input-placeholder mozilla */
  .add-big-query-dataset-container > input[type=text]::-moz-placeholder { font-size: 15pt; font-style:italic; }

  .bottom-buttons-container {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 0;
    margin-bottom: 50px;
  }

  .bottom-buttons-container > div > div > button {
    height: 120px;
    margin-top: 30px;
  }

</style>
