# cnv_notifier
cnv_notifier
# build container
docker build -t marcelogomesrp/cnv_collector .
# run 
docker run -it --rm -v /data:/data marcelogomesrp/cnv_collector