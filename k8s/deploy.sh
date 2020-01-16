echo "Starting to deploy"

echo "Installing Cloud SDK"

echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-sdk

echo "Adding Private Key"
echo $KEY_URL
sudo apt-get install wget
wget --no-check-certificate $KEY_URL -O key.json
cat key.json

echo "Adding Service accout"
gcloud auth activate-service-account rso-team-10@appspot.gserviceaccount.com --key-file=key.json --project=rso-team-10
gcloud config set project rso-team-10

echo "Kubectl Install"
sudo apt-get install kubectl

echo "Kubectl Config"
gcloud container clusters get-credentials rso-team-10 --zone europe-west1-b

echo "kubectl set image"

kubectl set image deployment/meetings-app meetings-app=vid99/meetings-service-image:$VERSION