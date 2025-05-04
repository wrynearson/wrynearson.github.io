---
title: Home Cloud
date: 2025-05-04
tags: [Coding, Projects]
description: Building a home server.
---

Computers are great. We rely on the ones in our pockets and on our desks, but we also interact with so many every time we visit a website or refresh an app. Those cloud computers (servers) help us collaborate and keep data up-to-date and safe.

They also come with costs, whether that's data ownership and privacy concerns, or limitation on the amount or access of the data. The data is also (unless synced and cached locally) not accessible if you're offline, or if the website is unreachable.

I have a collection of RAW photos from my dSLR camera that is approaching 1TB, that I have on a shared family OneDrive plan. Photography is something I care about, as are holding on to those (raw...) memories. I also have a normal Gmail that over the years has maxed out the 15GB free tier.

Late last year, these services started complaining that I was approaching their limits, and that I should pay monthly to have more available storage space. You've probably received these messages as well — something along the lines of:

> You're running out of space (which this email we're sending you to inform you of in fact contributes very slightly to your space issue). Pay us monthly, or you'll lose access to your data and our other services.

Despite being a rather cheap person (which is something I'm working on...), I have no issue paying for a service that brings value. For many, cloud storage is a great purchase. For the record, I did fork up a cheap monthly payment for the base paid tier of Google One, because I do get value out of Gmail and Drive, and will do so until I find a way to reduce my storage needs there.

OneDrive is more difficult. From what I can tell, they don't offer storage tiers above 1TB. Google does, but it costs CHF 120 / year. I bought a 4TB hard drive for less, but that comes at the risk of failure, or needing to plug it in every time I want to view photos.

Instead, I went down the rabbit hole of building my own.

# Requirements

1. I want to store my photos without monthly subscriptions.

That's it if we're being honest, but there's a much longer list of things that would be great.

1. View photos without having to plug in a hard drive.
2. Be able to edit those photos (which requires a fast-enough connection and storage medium to browse through large photo files).
3. Back up photos from my phone, because I honestly take way more photos with my phone than my dSLR.
4. Be able to add more capacity if my storage needs increase, which they will if I keep taking photos.
5. Not use too much electricity.
6. Not be noisy.
7. Learn more about computers and servers.
8. Not cost more than just paying the tech companies.
9. Have a good backup strategy for when I inevitably make a mistake or when hardware fails.

# Options

An external hard drive would meet my actual requirement, but none of the other nice-to-haves. A network attached storage device, or NAS, is a small computer with storage and it accessible any time over the local network. That would fit the requirements, but those aren't necessarily cheap.

In looking into NAS devices, I came across the wonderful world (and rabbit hole) that is the `homelab` and the community around it. The basic is to have a computer running 24/7 that can run one or more service. One of those "services" is storing and serving files. The sky is then the limit (or, better said, the rabbit hole has no bottom) for which services you want to run.

Suddenly my requirement list turned into a long wish list.

1. Block advertisement on the whole network (with a real benefit of decreasing loading times for web pages).
2. Have a shared network-accessible storage option for files besides photos.
3. Be able to run services separately (in virtual machines or Docker containers).
4. Access files and services securely while not at home.
5. Start monitoring electricity use of devices.
6. Run a virtual Windows machine for cross-device testing of projects at work.
7. Run monthly processing of large OSM dataset files (for https://willwill.run/watermap) without relying on me remembering to do so.
8. Make a custom endpoint of public transportation departures near my apartment to create a "leave by" notice and send to an LED Matrix device, or serve it as a simple web page.
9. ...

OK, before we fall too deep into this rabbit hole, I wanted to test the basics. Luckily, I had everything I already needed.

# Round 1

## Hardware

- A laptop from 2015 that has a broken keyboard.
- A 4TB external hard drive.
- A USB to ethernet adapter.

## Software

- [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview), a "hypervisor" that you can run virtual machines and containers in.
- OpenMediaVault (OMV), installed in the 1st VM, lets you make network shares via a GUI (instead of via the terminal).
- Ubuntu Server, installed in the 2nd VM.
- Docker, running in the 2nd VM, to manage containers for additional services.
  - Immich, an amazing open-source Google Photos alternative to back up and display photos.
  - Homepage, a way to more easily see (and remember) what's running where.
  - Filebrowser, a web-based file browser to see the 2nd VMs filesystem. _This ended up being a mistake because I messed up where Immich was storing photos._

## Cost

### Hardware

Technically free because I had everything already, if I needed to buy the parts:

- CHF 50 (estimate) for an old laptop with a broken keyboard.
- CHF 114 for [this](https://www.galaxus.ch/en/s1/product/seagate-expansion-portable-4-tb-external-hard-drives-16217707) 4TB external hard drive.
- CHF 10 for a USB to ethernet adapter

### Software

Free (thanks, open source)!

### Electricity

Roughly 10Wh _ 24 _ 365 = \_\_\_

## Summary

This was a great, low-stakes entry into the world of building a homelab. I could manage all of the VMs and services by going to my "homepage" and then clicking on the service to open it.

It was super easy to "mount" the network storage to my Mac, and be able to interact with photos from my dSLR. I could also store some large files on the same share to free up laptop storage space (however, I kept backups of all data elsewhere during this phase). Immich makes viewing and backing up photos from your phone trivially easy and snappy.

What wasn't snappy was trying to skim through RAW photos, or try to edit them in any way. If I loaded all of the photos into Photomator, the editor I've been trying out recently over Lightroom, it would never load. If I selectively added individual folders to Photomator, it'd load after ~30s, but each photo would take upwards of 5s to load.

Even more critically, this iteration felt fragile, being a laptop with a single external hard drive.

The next version would need to be snappier and have a solid backup plan.

# Round 2

Most NAS devices use spinning HDDs for storage. While they excel in low cost per TB of storage (sometimes as little as $15/TB), they're somewhat energy intensive, slow (especially and fetching lots of files, like what I'd be doing with the RAW photos), and sometimes noisy.

Solid-state storage (SSDs) were the clear answer. They're silent, durable (no moving parts), and much faster (in read/write speeds, and the number of operations they can do per second), but do cost more per TB.

I wasn't quite ready to build the PC from scratch, so I stumbled upon a company called CWWK that builds what looks like the perfect pre-built product — the Pocket NAS. It's absolutely tiny, fairly quiet, and has four m.2 SSD slots (the same type of SSD that's probably in your laptop), and fast ethernet ports, all at an affordable price. I could get started by just plugging in my storage, without having to build the thing from scratch.

While the product was built quite well, my unit unfortunately didn't deliver on its core promise of being a pocket NAS. Only one of the four m.2 SSD slots was being registered by the computer. Software and hardware checks weren't yielding results. Support instructions weren't so clear, so I think I flashed the wrong version of the updated BIOS on the device, rendering it unusable. Luckily, I was able to get a refund (return in progress and I write).

## Cost

### Hardware

- CHF (US$375) for the Pocket NAS (with an upgraded CPU, 16GB RAM, and a 256GB m.2 SSD boot drive)
- CHF 200 for two 2TB m.2 SDDs

### Software

Free (thanks, open source)!

### Electricity

If it were running 24/7, it was about 10W.

## Summary

While the potential was there, issues with the product led to a frustrating experience. I went back to the drawing board (Reddit forums). Building my own PC still felt like too deep of a rabbit hole, but the new pre-built solution didn't work out.

The next option was to look at the used PC market. Small business PCs from HP, Lenovo or Dell were promising.

1. They're well specked.
2. They use relatively little electricity depending on the model
3. They're quite affordable due to large businesses dumping them when they reach the end of their lifecycle.
4. They sometimes come with support and have readily-available parts.

After some research, I settled on the HP EliteDesk 800 G3, specifically the Small Form Factor (SFF) version. They're relatively small, very quiet, low powered, and have plenty of external and internal ports for upgradeability.

# Round 2.5

This round is short. I ordered the SFF version, but the mini (much smaller) was delivered. The mini variant didn't have the internal ports (PCIe) that I needed (details below), so I returned it.

# Round 3

## Hardware

- HP EliteDesk 800 G3 SFF.
- Two 2TB M.2 NVMe SSDs (purchased for round two).
- Two PCIe to m.2 NVMe SSD adapters (so I could plug the m.2 SSDs into the computer).
- (Later) 2x16GB RAM

## Software

- Proxmox
- TrueNAS Scale in the 1st VM to manage the two 2TB SSDs, using something fancy called ZFS (which lets you take and restore snapshots for part of a backup strategy). The data is "mirrored" across the two SSDs, so if one dies, the data survives.
- NextCloud in the 2nd VM to manage storing and serving data.
  - It's overkill, but I thought it'd be be nicer than just a network storage device to accessing photos.
  - It has a client app that lets you sync files by keeping files on the server, but letting you access them (online or offline) on your computer.
- PiHole, to block ads, in a small virtual container.
- Home Assistant (just starting on this...)
- Tailscale running in each VM, so I can access them in a safe way while away from home.

## Price

### Hardware

- CHF 117 for the HP computer (CHF 99 for the computer and CHF 18 for shipping) (refurbished).
- CHF 200 for two 2TB M.2 NVMe SSDs (new)
- CHF 36 for the 2x16GB RAM (used).

### Energy

### Conclusions
