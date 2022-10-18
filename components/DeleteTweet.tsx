import {
  Button,
  Col,
  Container,
  Grid,
  Popover,
  Row,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { mutate } from "swr";

export default function DeleteTweet(props: { id: string }) {
  const { id } = props;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hint, setHint] = useState("This step cannot be undone.");

  const deleteHandler = useCallback(async () => {
    try {
      setDeleting(true);
      setHint("Deleting...");
      const { data } = await axios.delete(`/api/tweet/${id}`);
      if (data.count > 0) {
        mutate("/api/tweet");
      }
      setPopoverOpen(false);
    } catch (e) {
      setHint("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }, [id]);

  return (
    <Popover
      isOpen={popoverOpen}
      onOpenChange={(isOpen) => {
        setHint("This step cannot be undone.");
        setPopoverOpen(isOpen);
      }}
      shouldCloseOnInteractOutside={() => !deleting}
    >
      <Popover.Trigger>
        <Button size="sm" color="error" auto>
          <TrashIcon />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Grid.Container
          css={{
            borderRadius: "14px",
            padding: "0.75rem",
            maxWidth: "330px",
          }}
        >
          <Row justify="center" align="center">
            <Text>Are you sure to delete?</Text>
          </Row>
          <Row justify="center">
            <Text>{hint}</Text>
          </Row>
          <Grid.Container
            css={{ mt: "$4" }}
            justify="space-between"
            alignContent="center"
          >
            <Grid>
              <Button
                disabled={deleting}
                size="sm"
                color="secondary"
                onPress={() => setPopoverOpen(false)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                disabled={deleting}
                size="sm"
                shadow
                color="error"
                onPress={deleteHandler}
              >
                Delete
              </Button>
            </Grid>
          </Grid.Container>
        </Grid.Container>
      </Popover.Content>
    </Popover>
  );
}
