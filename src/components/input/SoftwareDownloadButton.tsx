import DocumentDownloadIcon from "assets/icons/heroicons/document-download.svg";
import ChevronDownIcon from "assets/icons/heroicons/chevron-down.svg";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { DownloadsContext } from "~/context/downloads";
import Skeleton from "~/components/data/Skeleton";
import { getVersionBuildDownloadURL } from "~/service/v2";

const SoftwareDownloadButton = () => {
  const { projectId, project, builds } = useContext(DownloadsContext);

  const latestBuild = builds && builds[builds.length - 1];

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button className="rounded-lg px-5 py-3 flex flex-row items-center w-full md:w-100 bg-blue-600 transition-shadow text-white transition-color gap-8 hover:shadow-lg">
        <div className="w-8 h-8">
          <DocumentDownloadIcon />
        </div>
        <div className="text-left flex-1">
          {project && builds && latestBuild ? (
            <>
              <span className="font-medium text-lg">
                {project.name} {project.latestVersion}
              </span>
              <p className="text-gray-100">
                {latestBuild && `Build #${latestBuild.build}`}
              </p>
            </>
          ) : (
            <>
              <Skeleton className="w-40 mb-2" />
              <Skeleton className="w-20 h-5" />
            </>
          )}
        </div>
        <ChevronDownIcon className="w-6 h-6 text-gray-200" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 origin-top-left rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 w-full md:w-auto">
          {latestBuild &&
            Object.entries(latestBuild.downloads).map(([name, download]) => (
              <Menu.Item key={name}>
                {() => (
                  <div className="hover:bg-blue-100 transition-colors">
                    <a
                      href={
                        project &&
                        latestBuild &&
                        getVersionBuildDownloadURL(
                          projectId,
                          project.latestVersion,
                          latestBuild.build,
                          download.name
                        )
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="px-4 py-3">
                        <div className="font-medium">
                          {download.name}
                          {name === "application" && (
                            <span className="ml-2 text-xs rounded-full py-0.5 px-2 bg-yellow-200/80">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700 text-xs mt-1 truncate">
                          {download.sha256}
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SoftwareDownloadButton;
