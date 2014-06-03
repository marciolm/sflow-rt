This a fork of sflow-rt project from Peter Phaal with some hacks I've done in order to run his examples at http://blog.sflow.com/2013/08/frenetic-pyretic-and-resonance.html with the new Resonance version.

To run:
In the first ssh terminal:
sudo mn --controller=remote --topo=single,3 --mac --arp

In the second:
sudo ovs-vsctl -- --id=@sflow create sflow agent=eth0  target=\"127.0.0.1:6343\" sampling=2 polling=20 -- -- set bridge s1 sflow=@sflow
cd sflow-rt
./start.sh

In the 3rd:
cd ~/pyretic
pyretic.py pyretic.pyresonance.main --config=./pyretic/pyresonance/global.config --mode=manual

In the 4th
cd sflow-rt
nodejs extras/resonance2.js

In the 5th
cd ~/pyretic/pyretic/pyresonance
python json_sender.py --flow='{srcip=10.0.0.1}' -e auth -s authenticated -a 127.0.0.1 -p 50001
python json_sender.py --flow='{srcip=10.0.0.2}' -e auth -s authenticated -a 127.0.0.1 -p 50001
python json_sender.py --flow='{srcip=10.0.0.1}' -e ids -s clean -a 127.0.0.1 -p 50002
python json_sender.py --flow='{srcip=10.0.0.2}' -e ids -s clean -a 127.0.0.1 -p 50002

In the browser:
http://<IP Address of VM>:8008/metric/ALL/ddos/html



